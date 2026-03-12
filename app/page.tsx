"use client";

import { useEffect, useMemo, useState } from "react";

type LetterData = {
  sender: string;
  message: string;
  createdAt: string;
};

function encodePayload(data: LetterData) {
  const json = JSON.stringify(data);

  return btoa(unescape(encodeURIComponent(json)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function decodePayload(encoded: string): LetterData | null {
  try {
    const normalized = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
    const json = decodeURIComponent(escape(atob(padded)));
    const parsed = JSON.parse(json);

    if (
      typeof parsed?.sender === "string" &&
      typeof parsed?.message === "string" &&
      typeof parsed?.createdAt === "string"
    ) {
      return parsed;
    }

    return null;
  } catch {
    return null;
  }
}

function buildLink(payload: string) {
  return `${window.location.origin}${window.location.pathname}?letter=${payload}`;
}

function formatTime(value: string) {
  try {
    return new Date(value).toLocaleString("vi-VN");
  } catch {
    return value;
  }
}

function SparkleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3l1.7 5.1L19 10l-5.3 1.9L12 17l-1.7-5.1L5 10l5.3-1.9L12 3z" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 0 0-7.07-7.07L11 4" />
      <path d="M14 11a5 5 0 0 0-7.07 0L4.1 13.83a5 5 0 0 0 7.07 7.07L13 20" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M4 7l8 6 8-6" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20a8 8 0 0 1 16 0" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function ReplayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
    </svg>
  );
}

function EnvelopeScene({
  data,
  opened,
  onOpen,
}: {
  data: LetterData;
  opened: boolean;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      disabled={opened}
      className={`group relative h-[340px] w-full max-w-[430px] ${
        opened ? "cursor-default" : "cursor-pointer"
      } [perspective:1400px]`}
    >
      <div className="absolute inset-0 rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.82)_0%,rgba(17,24,39,0.95)_100%)] shadow-[0_30px_100px_rgba(0,0,0,0.45)]" />

      {!opened && (
        <div className="absolute inset-0 rounded-[34px] bg-fuchsia-500/5 blur-2xl transition group-hover:bg-fuchsia-500/10" />
      )}

      <div
        className="absolute left-1/2 top-[72px] z-[2] w-[78%] transition-all duration-[1000ms]"
        style={{
          transform: opened
            ? "translateX(-50%) translateY(-52px)"
            : "translateX(-50%) translateY(92px)",
        }}
      >
        <div className="rounded-[22px] border border-[#e7dccb] bg-[linear-gradient(180deg,#fffdf7_0%,#fff9ef_100%)] p-5 text-left text-[#3b3025] shadow-[0_18px_40px_rgba(0,0,0,0.20)]">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#b8a58c]">
              Lời nhắn
            </span>
            <span className="text-[10px] text-[#b8a58c]">{formatTime(data.createdAt)}</span>
          </div>

          <div className="h-[64px] overflow-hidden whitespace-pre-wrap text-sm leading-6 text-[#4b3c2d]">
            {data.message}
          </div>

          <div className="mt-4 text-sm font-semibold text-[#2f2419]">— {data.sender}</div>
        </div>
      </div>

      <div
        className="absolute left-1/2 top-[46px] z-[6] h-[132px] w-[86%] origin-top transition-transform duration-[900ms]"
        style={{
          transform: opened ? "translateX(-50%) rotateX(180deg)" : "translateX(-50%) rotateX(0deg)",
          clipPath: "polygon(0 0, 100% 0, 50% 100%)",
          background:
            "linear-gradient(180deg, #f472b6 0%, #c084fc 52%, #818cf8 100%)",
          borderTopLeftRadius: "28px",
          borderTopRightRadius: "28px",
          boxShadow: "0 10px 35px rgba(0,0,0,0.18)",
        }}
      />

      <div
        className="absolute bottom-[28px] left-1/2 z-[4] h-[190px] w-[86%] -translate-x-1/2 rounded-b-[30px]"
        style={{
          background:
            "linear-gradient(135deg, #ec4899 0%, #8b5cf6 48%, #38bdf8 100%)",
          clipPath: "polygon(0 0, 50% 42%, 100% 0, 100% 100%, 0 100%)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.28)",
        }}
      />

      <div
        className="absolute bottom-[28px] left-[7%] z-[5] h-[190px] w-[43%] rounded-bl-[30px]"
        style={{
          clipPath: "polygon(0 0, 100% 42%, 100% 100%, 0 100%)",
          background: "linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.04))",
        }}
      />

      <div
        className="absolute bottom-[28px] right-[7%] z-[5] h-[190px] w-[43%] rounded-br-[30px]"
        style={{
          clipPath: "polygon(0 42%, 100% 0, 100% 100%, 0 100%)",
          background: "linear-gradient(225deg, rgba(255,255,255,0.18), rgba(255,255,255,0.04))",
        }}
      />

      <div className="absolute bottom-[104px] left-1/2 z-[7] flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border border-white/20 bg-white/15 text-white shadow-lg backdrop-blur">
        <SparkleIcon />
      </div>

      {!opened && (
        <div className="absolute inset-x-0 bottom-8 z-[8] text-center">
          <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white/95 backdrop-blur">
            Bấm vào phong bì để mở thư
          </span>
        </div>
      )}
    </button>
  );
}

export default function Page() {
  const [sender, setSender] = useState("");
  const [message, setMessage] = useState("");
  const [shareLink, setShareLink] = useState("");
  const [copied, setCopied] = useState(false);

  const [viewData, setViewData] = useState<LetterData | null>(null);
  const [invalidLink, setInvalidLink] = useState(false);

  const [opened, setOpened] = useState(false);
  const [revealContent, setRevealContent] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get("letter");

    if (!encoded) {
      setViewData(null);
      setInvalidLink(false);
      return;
    }

    const data = decodePayload(encoded);

    if (data) {
      setViewData(data);
      setInvalidLink(false);
      setShareLink(window.location.href);
      setOpened(false);
      setRevealContent(false);
    } else {
      setViewData(null);
      setInvalidLink(true);
    }
  }, []);

  const canCreate = useMemo(() => {
    return sender.trim().length > 0 && message.trim().length > 0;
  }, [sender, message]);

  const createLink = () => {
    if (!canCreate) return;

    const payload = encodePayload({
      sender: sender.trim(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
    });

    const link = buildLink(payload);
    setShareLink(link);
    setCopied(false);
  };

  const copyLink = async () => {
    if (!shareLink) return;

    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  const resetForm = () => {
    setSender("");
    setMessage("");
    setShareLink("");
    setCopied(false);
  };

  const goHome = () => {
    setInvalidLink(false);
    setViewData(null);
    setOpened(false);
    setRevealContent(false);
    setShareLink("");
    window.history.replaceState({}, "", window.location.pathname);
  };

  const startOpenLetter = () => {
    if (opened) return;

    setOpened(true);
    setTimeout(() => {
      setRevealContent(true);
    }, 900);
  };

  const replayOpenAnimation = () => {
    setOpened(false);
    setRevealContent(false);

    setTimeout(() => {
      setOpened(true);
      setTimeout(() => setRevealContent(true), 900);
    }, 120);
  };

  if (invalidLink) {
    return (
      <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_#1e1b4b_0%,_#09090b_45%,_#020617_100%)] px-4 py-10 text-white">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-[36px] border border-white/10 bg-white/5 p-8 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl">
            <div className="mb-3 inline-flex rounded-full border border-rose-400/30 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-200">
              Link không hợp lệ
            </div>
            <h1 className="mb-3 text-3xl font-bold">Không thể mở bức thư này</h1>
            <p className="mb-6 leading-7 text-slate-300">
              Link có thể bị thiếu ký tự hoặc nội dung mã hóa không đúng định dạng.
            </p>

            <button
              onClick={goHome}
              className="rounded-2xl bg-white px-5 py-3 font-semibold text-slate-900 transition hover:scale-[1.02]"
            >
              Quay về trang tạo thư
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (viewData) {
    return (
      <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_#312e81_0%,_#111827_35%,_#020617_100%)] px-4 py-10 text-white">
        <div className="pointer-events-none absolute -left-16 top-10 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-slate-100 backdrop-blur">
                <MailIcon />
                Bạn nhận được một bức thư
              </div>
              <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
                Hãy bấm vào phong bì để mở
              </h1>
              <p className="mt-3 max-w-2xl text-slate-300">
                Nội dung chỉ xuất hiện sau khi người dùng trực tiếp bấm mở thư.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {opened && (
                <button
                  onClick={replayOpenAnimation}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 font-medium text-white backdrop-blur transition hover:bg-white/15"
                >
                  <ReplayIcon />
                  Mở lại hiệu ứng
                </button>
              )}

              <button
                onClick={goHome}
                className="rounded-2xl bg-white px-5 py-3 font-semibold text-slate-900 transition hover:scale-[1.02]"
              >
                Tạo thư mới
              </button>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <section className="rounded-[36px] border border-white/10 bg-white/5 p-6 shadow-[0_30px_120px_rgba(0,0,0,0.4)] backdrop-blur-xl md:p-8">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fuchsia-500/15 text-fuchsia-200">
                  <SparkleIcon />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Phong bì thư</h2>
                  <p className="text-sm text-slate-300">
                    {opened ? "Bức thư đang được mở ra" : "Bấm trực tiếp để mở thư"}
                  </p>
                </div>
              </div>

              <div className="flex justify-center">
                <EnvelopeScene data={viewData} opened={opened} onOpen={startOpenLetter} />
              </div>
            </section>

            <section className="rounded-[36px] border border-white/10 bg-white/5 p-6 shadow-[0_30px_120px_rgba(0,0,0,0.4)] backdrop-blur-xl md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-200">
                  <MailIcon />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Nội dung bức thư</h2>
                  <p className="text-sm text-slate-300">
                    {revealContent ? "Nội dung đã được mở" : "Chưa mở thư"}
                  </p>
                </div>
              </div>

              {!revealContent ? (
                <div className="flex min-h-[360px] items-center justify-center rounded-[28px] border border-dashed border-white/15 bg-white/5 p-8 text-center">
                  <div>
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-white">
                      <MailIcon />
                    </div>
                    <h3 className="mb-2 text-2xl font-bold text-white">Thư vẫn đang đóng</h3>
                    <p className="mx-auto max-w-md leading-7 text-slate-300">
                      Bấm vào phong bì ở bên trái, sau đó nội dung và người gửi mới xuất hiện tại đây.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="animate-[fadeIn_0.7s_ease] rounded-[28px] border border-white/10 bg-white/90 p-6 text-slate-800 shadow-inner md:p-8">
                  <div className="mb-6 rounded-[24px] bg-[linear-gradient(135deg,#fff7ed_0%,#fdf2f8_50%,#eff6ff_100%)] p-6 text-[17px] leading-8 text-slate-700 whitespace-pre-wrap">
                    {viewData.message}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-[22px] border border-slate-200 bg-white p-5">
                      <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-500">
                        <UserIcon />
                        Người gửi
                      </div>
                      <div className="text-lg font-bold text-slate-900">{viewData.sender}</div>
                    </div>

                    <div className="rounded-[22px] border border-slate-200 bg-white p-5">
                      <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-500">
                        <ClockIcon />
                        Thời điểm tạo
                      </div>
                      <div className="text-lg font-bold text-slate-900">
                        {formatTime(viewData.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>

        <style jsx global>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(18px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_#312e81_0%,_#111827_35%,_#020617_100%)] px-4 py-10 text-white">
      <div className="pointer-events-none absolute left-0 top-0 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-10 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-violet-500/15 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[38px] border border-white/10 bg-white/5 p-6 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl md:p-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-fuchsia-300/20 bg-fuchsia-500/10 px-4 py-2 text-sm font-semibold text-fuchsia-100">
            <SparkleIcon />
            Trình tạo link bức thư
          </div>

          <h1 className="max-w-3xl text-3xl font-bold tracking-tight md:text-5xl">
            Tạo lời nhắn và nhận một đường link mã hóa đẹp, sang và dễ chia sẻ
          </h1>

          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-slate-300 md:text-base">
            Nhập tên người gửi và nội dung lời nhắn. Sau khi xác nhận, hệ thống sẽ tạo ra
            một đường link dài đã mã hóa. Khi người nhận mở link đó, họ sẽ tự tay bấm mở phong bì để xem thư.
          </p>

          <div className="mt-8 grid gap-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-200">
                Tên người gửi
              </label>
              <input
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                placeholder="Ví dụ: Dat"
                className="w-full rounded-[22px] border border-white/10 bg-white/10 px-4 py-3.5 text-white shadow-sm outline-none backdrop-blur transition placeholder:text-slate-400 focus:border-fuchsia-300/40 focus:bg-white/15"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-200">
                Nội dung lời nhắn
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Viết lời nhắn của bạn tại đây..."
                className="min-h-[220px] w-full rounded-[22px] border border-white/10 bg-white/10 px-4 py-3.5 text-white shadow-sm outline-none backdrop-blur transition placeholder:text-slate-400 focus:border-fuchsia-300/40 focus:bg-white/15"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={createLink}
                disabled={!canCreate}
                className="inline-flex items-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#ec4899_0%,#8b5cf6_45%,#06b6d4_100%)] px-5 py-3.5 font-semibold text-white shadow-[0_18px_40px_rgba(236,72,153,0.28)] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <LinkIcon />
                Xác nhận tạo link
              </button>

              <button
                onClick={resetForm}
                className="rounded-2xl border border-white/10 bg-white/10 px-5 py-3.5 font-medium text-white transition hover:bg-white/15"
              >
                Làm lại
              </button>
            </div>
          </div>

          {shareLink && (
            <div className="mt-8 rounded-[28px] border border-white/10 bg-black/20 p-5 backdrop-blur">
              <div className="mb-2 text-sm font-semibold text-white">Link đã tạo</div>

              <div className="rounded-[20px] border border-white/10 bg-white/10 p-4 text-sm leading-7 text-slate-200 break-all">
                {shareLink}
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={copyLink}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-2.5 font-medium text-white transition hover:bg-white/15"
                >
                  <CopyIcon />
                  {copied ? "Đã sao chép" : "Sao chép link"}
                </button>

                <a
                  href={shareLink}
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 font-semibold text-slate-900 transition hover:scale-[1.02]"
                >
                  <MailIcon />
                  Mở bức thư
                </a>
              </div>
            </div>
          )}
        </section>

        <aside className="space-y-6">
          <div className="rounded-[34px] border border-cyan-300/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.96)_0%,rgba(17,24,39,0.92)_100%)] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.42)] md:p-8">
            <h2 className="text-2xl font-bold">Cách hoạt động</h2>

            <div className="mt-5 grid gap-3 text-sm text-slate-300">
              <div className="rounded-2xl border border-white/5 bg-white/5 p-4">1. Nhập tên người gửi</div>
              <div className="rounded-2xl border border-white/5 bg-white/5 p-4">2. Nhập nội dung lời nhắn</div>
              <div className="rounded-2xl border border-white/5 bg-white/5 p-4">3. Bấm xác nhận để tạo link</div>
              <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                4. Người nhận bấm vào phong bì để mở thư
              </div>
            </div>
          </div>

          <div className="rounded-[34px] border border-white/10 bg-white/5 p-6 shadow-[0_24px_90px_rgba(0,0,0,0.35)] backdrop-blur md:p-8">
            <h2 className="text-2xl font-bold">Điểm nổi bật</h2>

            <div className="mt-4 space-y-3 text-slate-300">
              <p>Phong bì đóng kín, không bị lòi lá thư ra ngoài như bản cũ.</p>
              <p>Người dùng phải tự bấm mới mở thư.</p>
              <p>Nội dung chỉ hiện sau hiệu ứng mở xong.</p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}