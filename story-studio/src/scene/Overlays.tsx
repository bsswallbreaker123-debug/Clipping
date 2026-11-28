import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { Banner, Phone, Popup } from "../types";

// All overlays are laid out in 1920x1080 scene space (the parent scales them).

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

export const PopupView: React.FC<{ popup: Popup; low?: boolean }> = ({ popup, low }) => {
  const f = useCurrentFrame();
  const accent = popup.color ?? (popup.style === "warning" ? "#ff4d5e" : popup.style === "success" ? "#38f28a" : "#3fd8ff");
  const open = interpolate(f, [0, 7], [0.02, 1], { ...clamp, easing: Easing.out(Easing.back(1.6)) });
  const glitch = f < 10 && f % 3 === 0 ? (f % 2 ? 8 : -8) : 0;
  const flicker = f < 12 ? (f % 4 < 2 ? 1 : 0.7) : 1;
  return (
    <div
      style={{
        position: "absolute",
        left: low ? 60 : "50%",
        top: low ? undefined : 120,
        bottom: low ? 70 : undefined,
        transform: low ? `translateX(${glitch}px) scaleY(${open})` : `translateX(calc(-50% + ${glitch}px)) scaleY(${open})`,
        opacity: flicker,
        minWidth: 620,
        maxWidth: 1100,
        padding: "26px 44px 30px",
        background: "linear-gradient(180deg, rgba(8,22,44,0.92), rgba(6,14,30,0.92))",
        border: `4px solid ${accent}`,
        borderRadius: 16,
        boxShadow: `0 0 30px ${accent}88, inset 0 0 40px ${accent}22`,
        color: "#fff",
        fontFamily: "Montserrat",
        textAlign: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0 2px, transparent 2px 6px)",
          transform: `translateY(${(f * 2) % 6}px)`,
        }}
      />
      <div style={{ fontWeight: 900, fontSize: 52, letterSpacing: 6, color: accent, textShadow: `0 0 18px ${accent}` }}>{popup.title}</div>
      {(popup.lines ?? []).map((l, i) => {
        const o = interpolate(f, [8 + i * 6, 14 + i * 6], [0, 1], clamp);
        return (
          <div key={i} style={{ fontWeight: 700, fontSize: 42, marginTop: 10, opacity: o, transform: `translateY(${(1 - o) * 10}px)` }}>
            {l}
          </div>
        );
      })}
    </div>
  );
};

// ---------- phone ----------

const Avatar: React.FC<{ size: number; color?: string }> = ({ size, color = "#f2c230" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx={50} cy={50} r={50} fill="#d9dde6" />
    <rect x={22} y={62} width={56} height={50} rx={22} fill={color} />
    <circle cx={50} cy={40} r={24} fill="#111" />
    <ellipse cx={42} cy={38} rx={3} ry={4} fill="#fff" />
    <ellipse cx={58} cy={38} rx={3} ry={4} fill="#fff" />
  </svg>
);

function useCount(target: string | undefined, f: number) {
  if (!target) return "";
  const m = target.match(/^([^0-9-]*)(-?[\d,.]+)(.*)$/);
  if (!m) return target;
  const num = parseFloat(m[2].replace(/,/g, ""));
  const decimals = (m[2].split(".")[1] ?? "").length;
  const k = interpolate(f, [8, 40], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const v = num * k;
  const s = v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return `${m[1]}${s}${m[3]}`;
}

export const PhoneView: React.FC<{ phone: Phone; dur: number }> = ({ phone, dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: f, fps, config: { damping: 15, stiffness: 120 } });
  const leave = interpolate(f, [dur - 8, dur], [0, 1], clamp);
  const y = (1 - enter) * 900 + leave * 40;
  const msgs = phone.messages ?? [];
  const per = msgs.length ? Math.max(10, (dur - 20) / msgs.length) : 0;
  const bigText = useCount(phone.big, f);
  const header = phone.title ?? { chat: "Messages", dating: "Spark", social: "Profile", notification: "", bank: "My Bank", search: "Search" }[phone.app];

  let body: React.ReactNode = null;
  if (phone.app === "chat" || phone.app === "notification") {
    body = (
      <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
        {phone.app === "notification" && (
          <div style={{ textAlign: "center", color: "#fff", fontSize: 92, fontWeight: 300, margin: "10px 0 20px" }}>{phone.big ?? "11:47"}</div>
        )}
        {msgs.map((m, i) => {
          const start = 6 + i * per;
          const typing = f >= start - 8 && f < start && phone.app === "chat";
          const o = interpolate(f, [start, start + 6], [0, 1], clamp);
          const mine = m.from === "me";
          if (typing && m.from === "them")
            return (
              <div key={i} style={{ alignSelf: "flex-start", background: "#3a3b44", borderRadius: 22, padding: "14px 20px", color: "#ccc", fontSize: 30 }}>
                • • •
              </div>
            );
          if (o <= 0) return null;
          if (phone.app === "notification")
            return (
              <div key={i} style={{ opacity: o, transform: `translateY(${(1 - o) * -20}px)`, background: "rgba(255,255,255,0.18)", borderRadius: 22, padding: "16px 20px", color: "#fff" }}>
                <div style={{ fontSize: 22, opacity: 0.75, fontWeight: 700 }}>{m.from === "me" ? "You" : header || "New message"} · now</div>
                <div style={{ fontSize: 30, fontWeight: 600, marginTop: 4 }}>{m.text}</div>
              </div>
            );
          return (
            <div
              key={i}
              style={{
                alignSelf: mine ? "flex-end" : "flex-start",
                maxWidth: "78%",
                opacity: o,
                transform: `scale(${0.85 + o * 0.15})`,
                transformOrigin: mine ? "right bottom" : "left bottom",
                background: mine ? "#2f80ff" : "#3a3b44",
                color: "#fff",
                borderRadius: 24,
                padding: "14px 20px",
                fontSize: 31,
                fontWeight: 600,
                lineHeight: 1.25,
              }}
            >
              {m.text}
            </div>
          );
        })}
      </div>
    );
  } else if (phone.app === "dating") {
    const swipe = interpolate(f, [dur * 0.65, dur * 0.85], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
    body = (
      <div style={{ padding: 22 }}>
        <div style={{ borderRadius: 28, overflow: "hidden", background: "linear-gradient(180deg,#ffb3c7,#ff6f91)", height: 470, display: "flex", alignItems: "center", justifyContent: "center", transform: `translateX(${swipe * (phone.sub?.toLowerCase().includes("match") ? 0 : -600)}px) rotate(${swipe * -18}deg)` }}>
          <Avatar size={300} color="#7b5cff" />
        </div>
        <div style={{ color: "#fff", fontSize: 40, fontWeight: 800, marginTop: 16 }}>{phone.big ?? "Jess, 21"}</div>
        <div style={{ color: "#ff6f91", fontSize: 30, fontWeight: 800, marginTop: 6 }}>{phone.sub}</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 60, marginTop: 18, fontSize: 56 }}>
          <span>❌</span>
          <span>💚</span>
        </div>
      </div>
    );
  } else {
    body = (
      <div style={{ padding: 26, color: "#fff", textAlign: "center" }}>
        {phone.app === "social" && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
            <Avatar size={170} />
          </div>
        )}
        {phone.app === "search" && (
          <div style={{ background: "#2a2b33", borderRadius: 40, padding: "18px 26px", fontSize: 30, textAlign: "left", marginTop: 20 }}>
            🔍 {(phone.big ?? "").slice(0, Math.floor(interpolate(f, [4, 34], [0, (phone.big ?? "").length], clamp)))}
            <span style={{ opacity: f % 16 < 8 ? 1 : 0 }}>|</span>
          </div>
        )}
        {phone.app !== "search" && (
          <div style={{ fontSize: Math.min(88, Math.floor(700 / Math.max(1, (phone.big ?? "").length))), fontWeight: 900, marginTop: 40, whiteSpace: "nowrap", color: phone.app === "bank" ? "#38f28a" : "#fff" }}>{bigText}</div>
        )}
        <div style={{ fontSize: 32, opacity: 0.8, marginTop: 12, fontWeight: 700 }}>{phone.sub}</div>
        {msgs.map((m, i) => {
          const o = interpolate(f, [14 + i * per, 20 + i * per], [0, 1], clamp);
          return (
            <div key={i} style={{ opacity: o, marginTop: 18, background: "#24252c", borderRadius: 18, padding: "16px 18px", fontSize: 28, textAlign: "left", fontWeight: 600 }}>
              {m.text}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div style={{ position: "absolute", left: "50%", top: 80, transform: `translate(-50%, ${y}px)`, width: 470, height: 960 }}>
      <div style={{ position: "absolute", inset: 0, background: "#0b0b0e", borderRadius: 64, border: "10px solid #2b2c33", boxShadow: "0 30px 80px rgba(0,0,0,0.55)", overflow: "hidden", fontFamily: "Inter" }}>
        <div style={{ height: 44, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ width: 130, height: 30, borderRadius: 20, background: "#000" }} />
        </div>
        {header && (
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "8px 22px 14px", borderBottom: "1px solid #24252c", color: "#fff" }}>
            {phone.app === "chat" && <Avatar size={56} />}
            <div style={{ fontSize: 32, fontWeight: 800 }}>{header}</div>
          </div>
        )}
        {body}
      </div>
    </div>
  );
};

// ---------- banners ----------

export const BannerView: React.FC<{ banner: Banner; dur: number }> = ({ banner, dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f, fps, config: { damping: 12, stiffness: 160 } });
  const style = banner.style ?? "ad";
  if (style === "stamp") {
    const k = interpolate(f, [0, 6], [2.4, 1], { ...clamp, easing: Easing.in(Easing.quad) });
    return (
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ transform: `rotate(-10deg) scale(${k})`, opacity: interpolate(f, [0, 3], [0, 1], clamp), border: "12px solid #e6283c", color: "#e6283c", padding: "14px 50px", borderRadius: 18, fontFamily: "Montserrat", fontWeight: 900, fontSize: 130, letterSpacing: 8, background: "rgba(255,255,255,0.85)" }}>
          {banner.text}
        </div>
      </div>
    );
  }
  if (style === "chapter") {
    const o = interpolate(f, [0, 8, dur - 8, dur], [0, 1, 1, 0], clamp);
    return (
      <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${0.75 * o})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ opacity: o, transform: `scale(${0.9 + 0.1 * s})`, color: "#fff", fontFamily: "Montserrat", fontWeight: 900, fontSize: 110, letterSpacing: 6, textAlign: "center", padding: 60 }}>
          {banner.text}
        </div>
      </div>
    );
  }
  if (style === "news") {
    return (
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 60, transform: `translateX(${(1 - s) * -1920}px)`, fontFamily: "Montserrat" }}>
        <div style={{ display: "inline-block", background: "#e6283c", color: "#fff", fontWeight: 900, fontSize: 46, padding: "10px 30px", letterSpacing: 3 }}>BREAKING NEWS</div>
        <div style={{ background: "rgba(255,255,255,0.95)", color: "#111", fontWeight: 800, fontSize: 56, padding: "16px 30px" }}>{banner.text}</div>
      </div>
    );
  }
  // ad
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 40, display: "flex", justifyContent: "center", transform: `translateY(${(1 - s) * -200}px)` }}>
      <div style={{ background: "linear-gradient(90deg,#0f4cd6,#2aa8ff)", color: "#fff", fontFamily: "Montserrat", fontWeight: 900, fontSize: 54, padding: "16px 46px", borderRadius: 14, letterSpacing: 3, boxShadow: "0 10px 30px rgba(0,0,0,0.35)" }}>
        {banner.text}
      </div>
    </div>
  );
};

export const EmojiBurst: React.FC<{ emoji: string }> = ({ emoji }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f, fps, config: { damping: 9, stiffness: 180 } });
  return (
    <div style={{ position: "absolute", right: 140, top: 140, fontSize: 200, transform: `scale(${s}) rotate(${Math.sin(f / 5) * 8}deg)`, filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.4))" }}>
      {emoji}
    </div>
  );
};
