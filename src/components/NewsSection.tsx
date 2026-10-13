import React, { useState, useEffect, useCallback } from "react";
import {
  Calendar, Clock, MapPin, ChevronRight, MessageCircle,
  X, Paperclip, ExternalLink, Newspaper, ZoomIn
} from "lucide-react";
import { NewsItem } from "../types";
import { api, COACH_WHATSAPP_LINK, resolveMediaUrl, isImageAttachment } from "../services/api";

interface NewsSectionProps {
  onNavigate?: (page: string) => void;
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

  useEffect(() => { api.getNews().then(setNews); }, []);

  /* Lock body scroll when modal / lightbox is open */
  useEffect(() => {
    document.body.style.overflow = selectedNews || lightboxUrl ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selectedNews, lightboxUrl]);

  /* ESC to close */
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

        {/* ── Category Tabs ── */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 44 }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              style={{
                padding: "10px 22px", borderRadius: 99, fontWeight: 700, fontSize: 14,
                cursor: "pointer", border: "none",
                background: activeTab === cat ? "#0A2352" : "#F0F4FC",
                color: activeTab === cat ? "#fff" : "#475569",
                transition: "all 0.2s ease", textTransform: "capitalize",
              }}
            >
              {cat === "all" ? "All Updates" : cat}
            </button>
          ))}
        </div>

        {/* ── Empty State ── */}
        {filteredNews.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#94A3B8" }}>
            <Newspaper size={52} strokeWidth={1} style={{ marginBottom: 14, opacity: 0.35 }} />
            <p style={{ fontSize: 16, fontWeight: 600 }}>No announcements in this category yet.</p>
          </div>
        )}

        {/* ── News Grid ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 380px), 1fr))",
          gap: 32,
        }}>
          {filteredNews.map(item => {
            const imgSrc = item.attachmentUrl ? resolveMediaUrl(item.attachmentUrl) : "";
            const isImg = isImageAttachment(item.attachmentUrl);
            const catStyle = getCategoryStyle(item.category);

            return (
              <div
                key={item.id || item._id}
                onClick={() => setSelectedNews(item)}
                className="news-card"
                style={{
                  background: "#ffffff", borderRadius: 22,
                  border: "1.5px solid #E2E8F0",
                  display: "flex", flexDirection: "column",
                  cursor: "pointer", overflow: "hidden",
                  boxShadow: "0 6px 24px rgba(10,35,82,0.07)",
                  transition: "transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease",
                }}
              >
                {/* ── Image Banner ── */}
                {isImg && imgSrc ? (
                  <div style={{
                    position: "relative", width: "100%",
                    aspectRatio: "16 / 9", background: "#0A1A3A",
                    overflow: "hidden", flexShrink: 0,
                  }}>
                    <img
                      src={imgSrc}
                      alt={item.title}
                      className="news-card-img"
                      style={{
                        width: "100%", height: "100%",
                        objectFit: "cover", display: "block",
                        transition: "transform 0.35s ease",
                      }}
                      loading="lazy"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                    />
                    <div style={{
                      position: "absolute", top: 12, right: 12,
                      background: "rgba(0,0,0,0.55)", borderRadius: 8,
                      padding: "5px 10px", display: "flex", alignItems: "center",
                      gap: 5, color: "#fff", fontSize: 12, fontWeight: 700,
                      backdropFilter: "blur(4px)",
                    }}>
                      <ZoomIn size={13} /> View
                    </div>
                  </div>
                ) : null}

                {/* ── Card Body ── */}
                <div style={{ padding: "24px 24px 20px", display: "flex", flexDirection: "column", flex: 1 }}>
                  {/* Badge + Date */}
                  <div style={{
                    display: "flex", alignItems: "center",
                    justifyContent: "space-between", gap: 8, marginBottom: 16, flexWrap: "wrap",
                  }}>
                    <span style={{
                      fontSize: 11.5, fontWeight: 800, textTransform: "uppercase",
                      letterSpacing: "0.07em", padding: "5px 13px", borderRadius: 99,
                      background: catStyle.bg, color: catStyle.color, whiteSpace: "nowrap",
                    }}>
                      {item.badge || item.category || "News"}
                    </span>
                    <div style={{
                      display: "flex", alignItems: "center", gap: 5,
                      fontSize: 12.5, fontWeight: 600, color: "#64748B", flexWrap: "wrap",
                    }}>
                      <Calendar size={14} color="#94A3B8" />
                      <span>{item.date}</span>
                      {item.time && (<><span>&middot;</span><Clock size={14} color="#94A3B8" /><span>{item.time}</span></>)}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: "#0A2352", lineHeight: 1.35, marginBottom: 12 }}>
                    {item.title}
                  </h3>

                  {/* Content — clamped 3 lines */}
                  {item.content && (
                    <p className="news-card-body" style={{
                      fontSize: 14.5, color: "#475569", lineHeight: 1.7,
                      marginBottom: 18, flex: 1,
                    }}>
                      {item.content}
                    </p>
                  )}

                  {/* Footer */}
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    borderTop: "1px solid #E2E8F0", paddingTop: 16, marginTop: "auto",
                    gap: 8, flexWrap: "wrap",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "#64748B" }}>
                      <MapPin size={14} color="#0A2352" />
                      <span>{item.location || "Adura Field, Alagbado"}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      {item.attachmentUrl && !isImg && (
                        <span style={{
                          fontSize: 11.5, fontWeight: 700, color: "#1448A8",
                          background: "#E8F0FC", padding: "4px 10px",
                          borderRadius: 6, display: "inline-flex", alignItems: "center", gap: 4,
                        }}>
                          <Paperclip size={12} />Attachment
                        </span>
                      )}
                      <span style={{
                        fontSize: 14, fontWeight: 700, color: "#1448A8",
                        display: "flex", alignItems: "center", gap: 3,
                      }}>
                        Details <ChevronRight size={15} />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ══ Detail Modal ════════════════════════════════════════════════════ */}
      {selectedNews && (() => {
        const selImgSrc = selectedNews.attachmentUrl ? resolveMediaUrl(selectedNews.attachmentUrl) : "";
        const selIsImg = isImageAttachment(selectedNews.attachmentUrl);
        const catStyle = getCategoryStyle(selectedNews.category);
        return (
          <div
            onClick={() => setSelectedNews(null)}
            style={{
              position: "fixed", inset: 0, zIndex: 9999,
              background: "rgba(6,22,53,0.78)", backdropFilter: "blur(6px)",
              display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
            }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                position: "relative", background: "#fff", borderRadius: 22,
                width: "100%", maxWidth: 600, maxHeight: "92vh", overflowY: "auto",
                boxShadow: "0 40px 100px rgba(6,22,53,0.35)",
              }}
            >
              {/* Image Hero in Modal */}
              {selIsImg && selImgSrc && (
                <div
                  onClick={() => setLightboxUrl(selImgSrc)}
                  style={{
                    position: "relative", width: "100%", aspectRatio: "16/9",
                    background: "#0A1A3A", overflow: "hidden",
                    cursor: "zoom-in", borderRadius: "22px 22px 0 0", flexShrink: 0,
                  }}
                  title="Click to enlarge"
                >
                  <img
                    src={selImgSrc}
                    alt={selectedNews.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                  <div style={{
                    position: "absolute", bottom: 12, right: 14,
                    background: "rgba(0,0,0,0.55)", color: "#fff",
                    fontSize: 12, fontWeight: 700, padding: "5px 12px", borderRadius: 8,
                    display: "flex", alignItems: "center", gap: 5, backdropFilter: "blur(4px)",
                  }}>
                    <ZoomIn size={13} /> Click to zoom
                  </div>
                </div>
              )}

              {/* Modal Body */}
              <div style={{ padding: "30px 30px 26px" }}>
                {/* Close Button */}
                <button
                  onClick={() => setSelectedNews(null)}
                  style={{
                    position: "absolute", top: 16, right: 16, border: "none",
                    background: "rgba(255,255,255,0.95)", borderRadius: "50%",
                    width: 36, height: 36, display: "grid", placeItems: "center",
                    cursor: "pointer", zIndex: 2, boxShadow: "0 2px 10px rgba(0,0,0,0.18)",
                  }}
                >
                  <X size={19} color="#475569" />
                </button>

                {/* Badge */}
                <span style={{
                  display: "inline-block", fontSize: 12, fontWeight: 800,
                  textTransform: "uppercase", letterSpacing: "0.07em",
                  padding: "5px 14px", borderRadius: 99, marginBottom: 16,
                  background: catStyle.bg, color: catStyle.color,
                }}>
                  {selectedNews.badge || selectedNews.category}
                </span>

                <h3 style={{ fontSize: 22, fontWeight: 800, color: "#0A2352", marginBottom: 16, lineHeight: 1.3 }}>
                  {selectedNews.title}
                </h3>

                {/* Meta */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 16,
                  fontSize: 13.5, color: "#64748B", marginBottom: 22, flexWrap: "wrap",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Calendar size={15} color="#1448A8" /><span>{selectedNews.date}</span>
                  </div>
                  {selectedNews.time && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Clock size={15} color="#1448A8" /><span>{selectedNews.time}</span>
                    </div>
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <MapPin size={15} color="#1F9D55" />
                    <span>{selectedNews.location || "Adura Field, Alagbado"}</span>
                  </div>
                </div>

                {/* Body */}
                {selectedNews.content && (
                  <p style={{ fontSize: 15.5, color: "#334155", lineHeight: 1.8, marginBottom: 24 }}>
                    {selectedNews.content}
                  </p>
                )}

                {/* Non-image attachment */}
                {selectedNews.attachmentUrl && !selIsImg && (
                  <a
                    href={selImgSrc}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      padding: "12px 18px", borderRadius: 10, background: "#F0F4FC",
                      color: "#1448A8", fontWeight: 700, fontSize: 14,
                      textDecoration: "none", marginBottom: 22, border: "1px solid #D6E0F2",
                    }}
                  >
                    <Paperclip size={17} />
                    <span>{selectedNews.attachmentName || "View Attachment"}</span>
                    <ExternalLink size={14} style={{ marginLeft: "auto" }} />
                  </a>
                )}

                {/* CTA */}
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <a
                    href={COACH_WHATSAPP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flex: 1, minWidth: 150, display: "flex", alignItems: "center",
                      justifyContent: "center", gap: 8, padding: "14px 18px",
                      borderRadius: 12, background: "#25D366", color: "#fff",
                      fontWeight: 700, fontSize: 14.5, textDecoration: "none",
                    }}
                  >
                    <MessageCircle size={17} /><span>Inquire on WhatsApp</span>
                  </a>
                  <button
                    onClick={() => setSelectedNews(null)}
                    style={{
                      padding: "14px 24px", borderRadius: 12, background: "#F1F5F9",
                      color: "#334155", fontWeight: 600, fontSize: 14.5,
                      border: "none", cursor: "pointer",
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ══ Full-screen Lightbox ═════════════════════════════════════════════ */}
      {lightboxUrl && (
        <div
          onClick={() => setLightboxUrl(null)}
          style={{
            position: "fixed", inset: 0, zIndex: 10999,
            background: "rgba(0,0,0,0.93)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 16, cursor: "zoom-out",
          }}
        >
          <button
            onClick={() => setLightboxUrl(null)}
            style={{
              position: "absolute", top: 16, right: 16, border: "none",
              background: "rgba(255,255,255,0.18)", borderRadius: "50%",
              width: 42, height: 42, display: "grid", placeItems: "center",
              cursor: "pointer",
            }}
          >
            <X size={22} color="#fff" />
          </button>
          <img
            src={lightboxUrl}
            alt="Enlarged view"
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: "95vw", maxHeight: "90vh",
              objectFit: "contain", borderRadius: 14,
              boxShadow: "0 30px 90px rgba(0,0,0,0.6)", cursor: "default",
            }}
          />
        </div>
      )}

      <style>{`
        .news-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 50px rgba(10,35,82,0.13) !important;
          border-color: #B9C9EA !important;
        }
        .news-card:hover .news-card-img { transform: scale(1.05); }
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
