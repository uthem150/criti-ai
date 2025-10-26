import { exec, execFile } from "child_process";
import { promisify } from "util";
import type {
  YoutubeVideoInfo,
  VideoTranscript,
  TranscriptSegment,
} from "@criti-ai/shared";
import type {
  YouTubeVideoResponse,
  YouTubeChannelResponse,
} from "../types/youtube-api.types.js";

const execFileAsync = promisify(execFile);
const execAsync = promisify(exec);

/**
 * YouTube 서비스
 *
 * yt-dlp를 사용하여 자막을 추출하고
 * YouTube Data API v3를 사용하여 메타데이터 수집
 *
 */
export class YoutubeService {
  private readonly youtubeApiKey: string;
  private readonly ytDlpPath: string;

  constructor() {
    // YouTube Data API 키 확인
    this.youtubeApiKey = process.env.YOUTUBE_API_KEY || "";
    if (!this.youtubeApiKey) {
      console.warn(
        "⚠️ YOUTUBE_API_KEY가 설정되지 않았습니다. 메타데이터 수집이 제한됩니다."
      );
    }

    // yt-dlp 경로 자동 감지
    // 1. 환경 변수에서 지정된 경로
    // 2. Docker 환경: /usr/bin/yt-dlp
    // 3. 로컬 환경: yt-dlp (PATH에서 찾기)
    this.ytDlpPath =
      process.env.YT_DLP_PATH ||
      (process.env.NODE_ENV === "production" ? "/usr/bin/yt-dlp" : "yt-dlp");

    console.log("✅ YoutubeService 초기화 완료");
    console.log(`📍 yt-dlp 경로: ${this.ytDlpPath}`);
  }

  /**
   * URL에서 비디오 ID 추출
   */
  extractVideoId(url: string): string | null {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();

      // youtube.com/watch?v=VIDEO_ID
      if (hostname.includes("youtube.com") && urlObj.pathname === "/watch") {
        return urlObj.searchParams.get("v");
      }

      // youtu.be/VIDEO_ID
      if (hostname === "youtu.be") {
        return urlObj.pathname.slice(1);
      }

      // youtube.com/shorts/VIDEO_ID
      if (
        hostname.includes("youtube.com") &&
        urlObj.pathname.startsWith("/shorts/")
      ) {
        const parts = urlObj.pathname.split("/");
        return parts[2] || null;
      }

      return null;
    } catch (error) {
      console.error("URL 파싱 오류:", error);
      return null;
    }
  }

  /**
   * 비디오 ID 검증 (보안)
   *
   * Command Injection 방지를 위한 검증
   */
  private validateVideoId(videoId: string): boolean {
    // 유튜브 비디오 ID는 정확히 11자리의 영문, 숫자, _, - 조합
    const videoIdRegex = /^[a-zA-Z0-9_-]{11}$/;
    return videoIdRegex.test(videoId);
  }

  /**
   * yt-dlp를 사용하여 자막 추출
   *
   * @param videoId - 유튜브 비디오 ID
   * @returns VideoTranscript - 자막 세그먼트와 전체 텍스트
   */
  async extractTranscript(videoId: string): Promise<VideoTranscript> {
    // 1. 비디오 ID 검증
    if (!this.validateVideoId(videoId)) {
      throw new Error("유효하지 않은 비디오 ID입니다.");
    }

    console.log(`📝 자막 추출 시작: ${videoId}`);

    // 임시 디렉토리 경로
    const tmpDir = "/tmp";
    const subtitlePath = `${tmpDir}/${videoId}`;

    try {
      // 2. yt-dlp 명령어 구성 (자막을 파일로 저장)
      const args = [
        "--skip-download",
        "--write-auto-subs",
        "--write-subs",
        "--sub-lang",
        "ko,en",
        "--sub-format",
        "json3",
        "--output",
        subtitlePath,
        "--no-warnings",
        `https://www.youtube.com/watch?v=${videoId}`,
      ];

      console.log("🚀 yt-dlp 실행 중...");

      // 3. execFile 사용 (exec보다 안전)
      // 부분 실패(예: 영어 자막 실패, 한국어 성공)는 무시
      try {
        await execFileAsync(this.ytDlpPath, args, {
          maxBuffer: 1024 * 2048, // 2MB
          timeout: 30000, // 30초 타임아웃
        });
        console.log("✅ yt-dlp 실행 완료");
      } catch (execError: any) {
        // 부분 실패(exit code 1)는 자막 파일이 하나라도 생성되었으면 OK
        console.warn(
          "⚠️ yt-dlp 부분 실패 (일부 자막은 성공했을 수 있음):",
          execError.message
        );
      }

      // 4. 생성된 자막 파일 찾기
      const possibleFiles = [
        `${subtitlePath}.ko.json3`,
        `${subtitlePath}.en.json3`,
        `${subtitlePath}.ko-KR.json3`,
        `${subtitlePath}.en-US.json3`,
      ];

      let subtitleFile: string | null = null;
      const fs = await import("fs");

      for (const file of possibleFiles) {
        if (fs.existsSync(file)) {
          subtitleFile = file;
          console.log(`📄 자막 파일 발견: ${file}`);
          break;
        }
      }

      if (!subtitleFile) {
        // ls로 실제 생성된 파일 확인
        const { stdout: lsOutput } = await execAsync(
          `ls -la ${tmpDir}/${videoId}* 2>/dev/null || echo "no files"`
        );
        console.log("📂 생성된 파일들:", lsOutput);

        throw new Error(
          "자막 파일을 찾을 수 없습니다. 이 비디오에는 자막이 없을 수 있습니다."
        );
      }

      // 5. 자막 파일 읽기 및 파싱
      const subtitleContent = fs.readFileSync(subtitleFile, "utf-8");
      const transcriptData = JSON.parse(subtitleContent);

      // 6. 파일 정리
      try {
        possibleFiles.forEach((file) => {
          if (fs.existsSync(file)) {
            fs.unlinkSync(file);
          }
        });
      } catch (cleanupError) {
        console.warn("⚠️ 임시 파일 정리 실패:", cleanupError);
      }

      // 7. 자막 세그먼트 변환
      const segments: TranscriptSegment[] = [];
      let fullText = "";

      // json3 형식 파싱
      if (transcriptData.events) {
        for (const event of transcriptData.events) {
          if (event.segs) {
            const text = event.segs.map((s: any) => s.utf8 || "").join("");
            if (text.trim()) {
              segments.push({
                text: text.trim(),
                start: event.tStartMs / 1000, // 밀리초 -> 초
                duration: (event.dDurationMs || 0) / 1000,
              });
              fullText += text.trim() + " ";
            }
          }
        }
      }

      if (segments.length === 0) {
        throw new Error("유효한 자막 세그먼트를 찾을 수 없습니다.");
      }

      console.log(`✅ 자막 추출 완료: ${segments.length}개 세그먼트`);
      console.log(`📝 전체 텍스트 길이: ${fullText.length}자`);

      return {
        segments,
        fullText: fullText.trim(),
        language: subtitleFile.includes(".ko") ? "ko" : "en",
      };
    } catch (error) {
      console.error("❌ 자막 추출 오류:", error);

      // 자막이 없는 경우 기본 응답
      if (
        error instanceof Error &&
        (error.message.includes("no suitable formats") ||
          error.message.includes("자막") ||
          error.message.includes("subtitle"))
      ) {
        throw new Error(
          "이 비디오에는 자막이 없거나 접근할 수 없습니다. 자막이 있는 비디오만 분석 가능합니다."
        );
      }

      throw error;
    }
  }

  /**
   * YouTube Data API v3를 사용하여 비디오 메타데이터 수집
   *
   * @param videoId - 유튜브 비디오 ID
   * @returns YoutubeVideoInfo - 비디오 정보
   */
  async fetchVideoMetadata(videoId: string): Promise<YoutubeVideoInfo> {
    if (!this.youtubeApiKey) {
      // API 키가 없는 경우 기본값 반환
      console.warn("⚠️ YouTube API 키가 없습니다. 기본 메타데이터 반환");
      return this.getDefaultVideoInfo(videoId);
    }

    // 비디오 ID 검증
    if (!this.validateVideoId(videoId)) {
      throw new Error("유효하지 않은 비디오 ID입니다.");
    }

    console.log(`📊 비디오 메타데이터 수집 시작: ${videoId}`);

    try {
      // YouTube Data API v3 호출
      // part=snippet,contentDetails,statistics
      const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,contentDetails,statistics&key=${this.youtubeApiKey}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `YouTube API 오류: ${response.status} ${response.statusText}`
        );
      }

      const data = (await response.json()) as YouTubeVideoResponse;

      if (!data.items || data.items.length === 0) {
        throw new Error("비디오를 찾을 수 없습니다.");
      }

      const video = data.items[0];

      // ISO 8601 duration을 초 단위로 변환
      const duration = this.parseDuration(
        video.contentDetails?.duration || "PT0S"
      );

      // 쇼츠 여부 판단 (60초 이하)
      const isShorts = duration <= 60;

      const videoInfo: YoutubeVideoInfo = {
        videoId,
        title: video.snippet?.title || "제목 없음",
        channelName: video.snippet?.channelTitle || "채널명 없음",
        channelId: video.snippet?.channelId || "",
        duration,
        viewCount: parseInt(video.statistics?.viewCount || "0", 10),
        likeCount: parseInt(video.statistics?.likeCount || "0", 10),
        publishedAt: video.snippet?.publishedAt || new Date().toISOString(),
        description: video.snippet?.description || "",
        thumbnailUrl:
          video.snippet?.thumbnails?.high?.url ||
          video.snippet?.thumbnails?.default?.url ||
          "",
        isShorts,
      };

      console.log("✅ 비디오 메타데이터 수집 완료");
      console.log(`📺 제목: ${videoInfo.title}`);
      console.log(`👤 채널: ${videoInfo.channelName}`);
      console.log(`⏱️ 길이: ${duration}초 (쇼츠: ${isShorts})`);
      console.log(`👁️ 조회수: ${videoInfo.viewCount.toLocaleString()}`);

      return videoInfo;
    } catch (error) {
      console.error("❌ 비디오 메타데이터 수집 오류:", error);

      // 오류 시 기본값 반환
      return this.getDefaultVideoInfo(videoId);
    }
  }

  /**
   * YouTube Data API v3를 사용하여 채널 메타데이터 수집
   *
   * @param channelId - 유튜브 채널 ID
   * @returns 구독자 수 등 채널 정보
   */
  async fetchChannelMetadata(
    channelId: string
  ): Promise<{ subscriberCount: number; verificationStatus: string }> {
    if (!this.youtubeApiKey) {
      console.warn("⚠️ YouTube API 키가 없습니다. 기본 채널 정보 반환");
      return {
        subscriberCount: 0,
        verificationStatus: "unverified",
      };
    }

    console.log(`👤 채널 메타데이터 수집 시작: ${channelId}`);

    try {
      const url = `https://www.googleapis.com/youtube/v3/channels?id=${channelId}&part=statistics,status&key=${this.youtubeApiKey}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `YouTube API 오류: ${response.status} ${response.statusText}`
        );
      }

      const data = (await response.json()) as YouTubeChannelResponse;

      if (!data.items || data.items.length === 0) {
        throw new Error("채널을 찾을 수 없습니다.");
      }

      const channel = data.items[0];

      const subscriberCount = parseInt(
        channel.statistics?.subscriberCount || "0",
        10
      );
      const verificationStatus =
        channel.status?.isLinked === true ? "verified" : "unverified";

      console.log("✅ 채널 메타데이터 수집 완료");
      console.log(`👥 구독자 수: ${subscriberCount.toLocaleString()}`);
      console.log(`✓ 인증 상태: ${verificationStatus}`);

      return {
        subscriberCount,
        verificationStatus,
      };
    } catch (error) {
      console.error("❌ 채널 메타데이터 수집 오류:", error);

      return {
        subscriberCount: 0,
        verificationStatus: "unverified",
      };
    }
  }

  /**
   * ISO 8601 duration 초 단위로 변환
   *
   * 예: PT15M33S -> 933 (15분 33초)
   */
  private parseDuration(isoDuration: string): number {
    const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

    if (!match) {
      return 0;
    }

    const hours = parseInt(match[1] || "0", 10);
    const minutes = parseInt(match[2] || "0", 10);
    const seconds = parseInt(match[3] || "0", 10);

    return hours * 3600 + minutes * 60 + seconds;
  }

  /**
   * 기본 비디오 정보 반환 (API 키가 없거나 오류 시)
   */
  private getDefaultVideoInfo(videoId: string): YoutubeVideoInfo {
    return {
      videoId,
      title: "제목 정보 없음",
      channelName: "채널 정보 없음",
      channelId: "",
      duration: 0,
      viewCount: 0,
      likeCount: 0,
      publishedAt: new Date().toISOString(),
      description: "",
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      isShorts: false,
    };
  }
}

// 싱글톤 인스턴스
export const youtubeService = new YoutubeService();
