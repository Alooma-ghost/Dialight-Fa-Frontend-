import React, { useState, useEffect, useCallback } from "react";
import {
  Calendar, Clock, MapPin, ChevronRight, MessageCircle,
  X, Paperclip, ExternalLink, Image as ImageIcon, ZoomIn
} from "lucide-react";
import { NewsItem } from "../types";
import { api, COACH_WHATSAPP_LINK } from "../services/api";

interface NewsSectionProps {
  onNavigate?: (page: string) => void;
}

function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    if (isLocal) return "http://localhost:5000";
    return `${protocol}//${hostname}`;
  }
  return "";
}

function isImageAttachment(item: NewsItem): boolean {
  const url = (item.attachmentUrl || "").toLowerCase();
  const name = (item.attachmentName || "").toLowerCase();
  return /\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?.*)?$/.test(url) ||
    /\.(jpg|jpeg|png|gif|webp|svg|bmp)$/.test(name);
}

function resolveAttachmentUrl(url: string): string {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${getBaseUrl()}${url}`;
}

const CATEGORY_STYLES: Record<string, { bg: string; color: string }> = {
  Training:     { bg: "#E6F6EC", color: "#1F9D55" },
  Trials:       { bg: "#FFF4E5", color: "#D97706" },
  Match:        { bg: "#E8F0FC", color: "#1448A8" },
  Announcement: { bg: "#F3E8FF", color: "#7C3AED" },
};

function getCategoryStyle(cat?: string) {
  return CATEGORY_STYLES[cat || ""] || { bg: "#F0F4FC", color: "#475569" };
}

export const NewsSection: React.FC<NewsSectionProps> = ({ onNavigate }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  useEffect(() => {
    api.getNews().then(setNews);
  }, []);

  useEffect(() => {
    document.body.style.overflow = selectedNews || lightboxUrl ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selectedNews, lightboxUrl]);

  const handleKeydown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      if (lightboxUrl) setLightboxUrl(null);
      else setSelectedNews(null);
    }
  }, [lightboxUrl]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [handleKeydown]);

  const categories = ["all", "Training", "Trials", "Match", "Announcement"];

  const filteredNews = activeTab === "all"
    ? news
    : news.filter(n => (n.category || "").toLowerCase() === activeTab.toLowerCase());

  return (
    <section id="academy-news" className="section" style={{ background: "#ffffff", padding: "64px 0" }}>
      <div className="container">
        <div className="section-head">
          <span className="section-tag">Updates &amp; Bulletins</span>
          <h2 className="section-title">Academy News &amp; Announcements</h2>
          <p className="section-desc">
            Stay up to date with match announcements, upcoming trials, pitchside reports and official training schedules at Adura Field.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 40 }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              style={{
                padding: "9px 20px",
                borderRadius: 99,
                fontWeight: 700,
                fontSize: 13.5,
                cursor: "pointer",
                border: "none",
                background: activeTab === cat ? "#0A2352" : "#F0F4FC",
                color: activeTab === cat ? "#ffffff" : "#475569",
                transition: "all 0.2s ease",
                textTransform: "capitalize",
              }}
            >
              {cat === "all" ? "All Updates" : cat}
            </button>
          ))}
        </div>

        {/* Empty state */}
        {filteredNews.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 0", color: "#94A3B8" }}>
            <ImageIcon size={48} strokeWidth={1} style={{ marginBottom: 12, opacity: 0.4 }} />
            <p style={{ fontSize: 15, fontWeight: 600 }}>No announcements in this category yet.</p>
          </div>
        )}

        {/* News Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))",
          gap: 28,
        }}>
          {filteredNews.map(item => {
            const isImg = isImageAttachment(item);
            const absUrl = resolveAttachmentUrl(item.attachmentUrl || "");
            const catStyle = getCategoryStyle(item.category);

            return (
              <div
                key={item.id || item._id}
                onClick={() => setSelectedNews(item)}
                className="news-card"
                style={{
                  background: "#ffffff",
                  borderRadius: 20,
                  border: "1.5px solid #E2E8F0",
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                  transition: "transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease",
                  overflow: "hidden",
                  boxShadow: "0 4px 16px rgba(10,35,82,0.05)",
                }}
              >
                {/* Image banner */}
                {isImg && absUrl ? (
                  <div style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "16 / 9",
                    background: "#0A1A3A",
                    overflow: "hidden",
                    flexShrink: 0,
                  }}>
                    <img
                      src={absUrl}
                      alt={item.title}
                      className="news-card-img"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                        transition: "transform 0.3s ease",
                      }}
                      loading="lazy"
                    />
                    <div style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      background: "rgba(0,0,0,0.45)",
                      borderRadius: 8,
                      padding: "4px 8px",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      color: "#fff",
                      fontSize: 11,
                      fontWeight: 700,
                      backdropFilter: "blur(4px)",
                    }}>
                      <ZoomIn size={12} /> View
                    </div>
                  </div>
                ) : null}

                {/* Card body */}
                <div style={{ padding: "22px 22px 18px", display: "flex", flexDirection: "column", flex: 1 }}>
                  {/* Badge + Date */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
                    <span style={{
                      fontSize: 11,
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      padding: "4px 11px",
                      borderRadius: 99,
                      background: catStyle.bg,
                      color: catStyle.color,
                      whiteSpace: "nowrap",
                    }}>
                      {item.badge || item.category || "News"}
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: "#64748B", flexWrap: "wrap" }}>
                      <Calendar size={13} color="#94A3B8" />
                      <span>{item.date}</span>
                      {item.time && (<><span>&middot;</span><Clock size={13} color="#94A3B8" /><span>{item.time}</span></>)}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0A2352", lineHeight: 1.35, marginBottom: 10 }}>
                    {item.title}
                  </h3>

                  {/* Content preview — clamped to 3 lines */}
                  {item.content && (
                    <p className="news-card-body" style={{
                      fontSize: 14,
                      color: "#475569",
                      lineHeight: 1.65,
                      marginBottom: 16,
                      flex: 1,
                    }}>
                      {item.content}
                    </p>
                  )}

                  {/* Footer */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #E2E8F0", paddingTop: 14, marginTop: "auto", gap: 8, flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#64748B" }}>
                      <MapPin size={13} color="#0A2352" />
                      <span>{item.location || "Adura Field, Alagbado"}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      {item.attachmentUrl && !isImg && (
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#1448A8", background: "#E8F0FC", padding: "3px 8px", borderRadius: 6, display: "inline-flex", alignItems: "center", gap: 4 }}>
                          <Paperclip size={11} />Attachment
                        </span>
                      )}
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#1448A8", display: "flex", alignItems: "center", gap: 2 }}>
                        Details <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedNews && (
        <div
          onClick={() => setSelectedNews(null)}
          style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(6,22,53,0.75)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ position: "relative", background: "#fff", borderRadius: 20, width: "100%", maxWidth: 580, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 32px 80px rgba(6,22,53,0.3)" }}
          >
            {/* Image hero */}
            {isImageAttachment(selectedNews) && selectedNews.attachmentUrl && (
              <div
                onClick={() => setLightboxUrl(resolveAttachmentUrl(selectedNews.attachmentUrl || ""))}
                style={{ position: "relative", width: "100%", aspectRatio: "16/9", background: "#0A1A3A", overflow: "hidden", cursor: "zoom-in", borderRadius: "20px 20px 0 0" }}
                title="Click to enlarge"
              >
                <img
                  src={resolveAttachmentUrl(selectedNews.attachmentUrl)}
                  alt={selectedNews.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
                <div style={{ position: "absolute", bottom: 10, right: 12, background: "rgba(0,0,0,0.5)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 8, display: "flex", alignItems: "center", gap: 5, backdropFilter: "blur(4px)" }}>
                  <ZoomIn size={12} /> Click to zoom
                </div>
              </div>
            )}

            {/* Modal body */}
            <div style={{ padding: "28px 28px 24px" }}>
              {/* Close */}
              <button
                onClick={() => setSelectedNews(null)}
                style={{ position: "absolute", top: 16, right: 16, border: "none", background: "rgba(255,255,255,0.9)", borderRadius: "50%", width: 34, height: 34, display: "grid", placeItems: "center", cursor: "pointer", zIndex: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
              >
                <X size={18} color="#475569" />
              </button>

              {/* Badge */}
              <span style={{ display: "inline-block", fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", padding: "4px 12px", borderRadius: 99, marginBottom: 14, ...getCategoryStyle(selectedNews.category) }}>
                {selectedNews.badge || selectedNews.category}
              </span>

              <h3 style={{ fontSize: 21, fontWeight: 800, color: "#0A2352", marginBottom: 14, lineHeight: 1.3 }}>
                {selectedNews.title}
              </h3>

              <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 13, color: "#64748B", marginBottom: 20, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Calendar size={14} color="#1448A8" /><span>{selectedNews.date}</span></div>
                {selectedNews.time && <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Clock size={14} color="#1448A8" /><span>{selectedNews.time}</span></div>}
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}><MapPin size={14} color="#1F9D55" /><span>{selectedNews.location || "Adura Field, Alagbado"}</span></div>
              </div>

              {selectedNews.content && (
                <p style={{ fontSize: 15, color: "#334155", lineHeight: 1.75, marginBottom: 22 }}>{selectedNews.content}</p>
              )}

              {/* Non-image attachment */}
              {selectedNews.attachmentUrl && !isImageAttachment(selectedNews) && (
                <a
                  href={resolveAttachmentUrl(selectedNews.attachmentUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 16px", borderRadius: 10, background: "#F0F4FC", color: "#1448A8", fontWeight: 700, fontSize: 13.5, textDecoration: "none", marginBottom: 20, border: "1px solid #D6E0F2" }}
                >
                  <Paperclip size={16} />
                  <span>{selectedNews.attachmentName || "View Attachment"}</span>
                  <ExternalLink size={13} style={{ marginLeft: "auto" }} />
                </a>
              )}

              {/* CTA */}
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <a
                  href={COACH_WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ flex: 1, minWidth: 140, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "13px 18px", borderRadius: 12, background: "#25D366", color: "#fff", fontWeight: 700, fontSize: 14, textDecoration: "none" }}
                >
                  <MessageCircle size={16} /><span>Inquire on WhatsApp</span>
                </a>
                <button
                  onClick={() => setSelectedNews(null)}
                  style={{ padding: "13px 22px", borderRadius: 12, background: "#F1F5F9", color: "#334155", fontWeight: 600, fontSize: 14, border: "none", cursor: "pointer" }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxUrl && (
        <div
          onClick={() => setLightboxUrl(null)}
          style={{ position: "fixed", inset: 0, zIndex: 10999, background: "rgba(0,0,0,0.92)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, cursor: "zoom-out" }}
        >
          <button
            onClick={() => setLightboxUrl(null)}
            style={{ position: "absolute", top: 16, right: 16, border: "none", background: "rgba(255,255,255,0.15)", borderRadius: "50%", width: 40, height: 40, display: "grid", placeItems: "center", cursor: "pointer" }}
          >
            <X size={20} color="#fff" />
          </button>
          <img
            src={lightboxUrl}
            alt="Enlarged view"
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: "95vw", maxHeight: "90vh", objectFit: "contain", borderRadius: 12, boxShadow: "0 24px 80px rgba(0,0,0,0.5)", cursor: "default" }}
          />
        </div>
      )}

      <style>{`
        .news-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(10,35,82,0.10);
          border-color: #B9C9EA;
        }
        .news-card:hover .news-card-img {
          transform: scale(1.04);
        }
        .news-card-body {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};
