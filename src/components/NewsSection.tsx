import React, { useState, useEffect, useCallback } from "react";
import {
  Calendar, Clock, MapPin, ChevronRight, MessageCircle,
  X, Paperclip, ExternalLink, Newspaper, ZoomIn, Star, Shield
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

// Fallback high-res academy alumni images so every card has a full photo like Alumni cards
const FALLBACK_NEWS_IMAGES = [
  "/alumni/opebi-ibrahim.jpg",
  "/alumni/fabiola-gideon.jpg",
];

function getCardImage(item: NewsItem, index: number): string {
  if (item.attachmentUrl && isImageAttachment(item.attachmentUrl)) {
    return resolveMediaUrl(item.attachmentUrl);
  }
  return FALLBACK_NEWS_IMAGES[index % FALLBACK_NEWS_IMAGES.length];
}

export const NewsSection: React.FC<NewsSectionProps> = ({ onNavigate }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  useEffect(() => {
    api.getNews().then(setNews);
  }, []);

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
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [handleKeydown]);

  const categories = [
    { key: "all", label: "All Updates" },
    { key: "Training", label: "Training" },
    { key: "Trials", label: "Trials" },
    { key: "Match", label: "Match Day" },
    { key: "Announcement", label: "Announcements" },
  ];

  const filteredNews = activeTab === "all"
    ? news
    : news.filter(n => (n.category || "").toLowerCase() === activeTab.toLowerCase());

  return (
    <section id="academy-news" className="section" style={{ background: "#F8FAFD", padding: "80px 0" }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-head" style={{ textAlign: "center", maxWidth: 760, margin: "0 auto 50px" }}>
          <span className="section-tag" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Newspaper size={14} /> Academy News &amp; Updates
          </span>
          <h2 className="section-title" style={{ fontSize: "clamp(30px, 4.5vw, 46px)" }}>
            Latest Academy News &amp; Bulletins
          </h2>
          <p className="section-desc" style={{ fontSize: 16 }}>
            Stay informed with official announcements, training schedules, match fixture reports, and trial opportunities direct from Adura Field, Alagbado.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div style={{
          display: "flex", justifyContent: "center", gap: 10,
          marginBottom: 44, flexWrap: "wrap",
        }}>
          {categories.map(cat => {
            const isActive = activeTab === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveTab(cat.key)}
                style={{
                  padding: "10px 20px",
                  borderRadius: 99,
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  border: isActive ? "2px solid #0A2352" : "1.5px solid #D6E0F2",
                  background: isActive ? "#0A2352" : "#ffffff",
                  color: isActive ? "#ffffff" : "#475569",
                  boxShadow: isActive ? "0 4px 14px rgba(10,35,82,0.18)" : "none",
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* ══ News Cards Grid — Exactly matching Alumni cards layout ══ */}
        {filteredNews.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "60px 20px", background: "#ffffff",
            borderRadius: 20, border: "1.5px dashed #CBD5E1", maxWidth: 500, margin: "0 auto 48px",
          }}>
            <Newspaper size={44} color="#94A3B8" style={{ marginBottom: 14 }} />
            <h3 style={{ fontSize: 18, color: "#0A2352", fontWeight: 700, marginBottom: 6 }}>
              No News in this Category
            </h3>
            <p style={{ color: "#64748B", fontSize: 14, margin: 0 }}>
              Select "All Updates" to view all academy bulletins and announcements.
            </p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
            gap: 32,
            marginBottom: 48,
          }}>
            {filteredNews.map((item, index) => {
              const cardImgSrc = getCardImage(item, index);
              const isRealImgAttachment = !!item.attachmentUrl && isImageAttachment(item.attachmentUrl);
              const isDocAttachment = !!item.attachmentUrl && !isRealImgAttachment;

              return (
                <div
                  key={item.id}
                  className="news-card"
                  style={{
                    background: "#ffffff",
                    borderRadius: 24,
                    overflow: "hidden",
                    border: "1.5px solid #D6E0F2",
                    boxShadow: "0 16px 40px rgba(10, 35, 82, 0.08)",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
                  }}
                >
                  {/* ── Full-portrait 3:4 photo exactly like Alumni card ── */}
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      aspectRatio: "3 / 4",
                      background: "#0A1A3A",
                      overflow: "hidden",
                      cursor: "zoom-in",
                    }}
                    onClick={() => setLightboxUrl(cardImgSrc)}
                    title="Click to view full picture"
                  >
                    <img
                      src={cardImgSrc}
                      alt={item.title}
                      className="news-img"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center center",
                        transition: "transform 0.4s ease",
                        display: "block",
                      }}
                      loading="lazy"
                      onError={(e) => {
                        // Fallback to alumni image if image fails
                        const target = e.currentTarget as HTMLImageElement;
                        target.src = FALLBACK_NEWS_IMAGES[index % FALLBACK_NEWS_IMAGES.length];
                      }}
                    />

                    {/* Zoom hint top-right */}
                    <div style={{
                      position: "absolute", top: 14, right: 14,
                      background: "rgba(255,255,255,0.16)", backdropFilter: "blur(6px)",
                      border: "1px solid rgba(255,255,255,0.22)", color: "#fff",
                      borderRadius: 8, padding: "5px 8px", fontSize: 11, fontWeight: 700,
                      display: "flex", alignItems: "center", gap: 4, pointerEvents: "none",
                      zIndex: 2,
                    }}>
                      <ZoomIn size={13} /> Full View
                    </div>

                    {/* Gradient overlay */}
                    <div style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to top, rgba(6, 22, 53, 0.95) 0%, rgba(6, 22, 53, 0.3) 50%, transparent 100%)",
                      pointerEvents: "none",
                    }} />

                    {/* Badge top-left */}
                    <div style={{
                      position: "absolute",
                      top: 16,
                      left: 16,
                      background: "rgba(6, 22, 53, 0.85)",
                      backdropFilter: "blur(8px)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      color: "#FFD700",
                      padding: "5px 12px",
                      borderRadius: 99,
                      fontSize: 12,
                      fontWeight: 800,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      zIndex: 2,
                    }}>
                      <Star size={13} fill="#FFD700" /> {item.badge || item.category || "Dialight FA Official"}
                    </div>

                    {/* Title & category on bottom of photo overlay */}
                    <div style={{
                      position: "absolute",
                      bottom: 16,
                      left: 20,
                      right: 20,
                      zIndex: 2,
                    }}>
                      <div style={{
                        fontSize: 12,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        color: "#4ADE80",
                        letterSpacing: "0.06em",
                        marginBottom: 4,
                      }}>
                        {item.category} &bull; {item.date}
                      </div>
                      <h3 style={{
                        color: "#ffffff",
                        fontSize: 22,
                        fontWeight: 900,
                        margin: 0,
                        letterSpacing: "0.01em",
                        lineHeight: 1.3,
                      }}>
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  {/* ── Content Body exactly like Alumni card ── */}
                  <div style={{
                    padding: "26px 24px",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}>
                    <div>
                      {/* Meta: Location, Time */}
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        fontSize: 13,
                        color: "#64748B",
                        marginBottom: 14,
                        flexWrap: "wrap",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          <Calendar size={14} color="#1448A8" />
                          <span>{item.date}</span>
                        </div>
                        {item.time && (
                          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                            <Clock size={14} color="#1448A8" />
                            <span>{item.time}</span>
                          </div>
                        )}
                        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          <MapPin size={14} color="#1F9D55" />
                          <span>{item.location || "Adura Field, Alagbado"}</span>
                        </div>
                      </div>

                      {/* Excerpt Story */}
                      {item.content && (
                        <p style={{
                          fontSize: 14.5,
                          color: "#475569",
                          lineHeight: 1.65,
                          marginBottom: 18,
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}>
                          {item.content}
                        </p>
                      )}

                      {/* Document attachment if not an image */}
                      {isDocAttachment && (
                        <a
                          href={resolveMediaUrl(item.attachmentUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "10px 14px",
                            borderRadius: 10,
                            background: "#F0F4FC",
                            color: "#1448A8",
                            fontWeight: 700,
                            fontSize: 13,
                            textDecoration: "none",
                            marginBottom: 16,
                            border: "1px solid #D6E0F2",
                          }}
                        >
                          <Paperclip size={15} />
                          <span>{item.attachmentName || "View Document Attachment"}</span>
                          <ExternalLink size={13} style={{ marginLeft: "auto" }} />
                        </a>
                      )}

                      {/* Action buttons */}
                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18 }}>
                        <button
                          onClick={() => setSelectedNews(item)}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "10px 18px",
                            borderRadius: 10,
                            background: "#0A2352",
                            color: "#fff",
                            fontWeight: 700,
                            fontSize: 13,
                            border: "none",
                            cursor: "pointer",
                            transition: "background 0.2s",
                          }}
                        >
                          <span>Read Full Story</span>
                          <ChevronRight size={15} />
                        </button>

                        <button
                          onClick={() => setLightboxUrl(cardImgSrc)}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "10px 16px",
                            borderRadius: 10,
                            background: "#F1F5F9",
                            color: "#0A2352",
                            fontWeight: 700,
                            fontSize: 13,
                            border: "1.5px solid #CBD5E1",
                            cursor: "pointer",
                            transition: "background 0.2s",
                          }}
                        >
                          <ZoomIn size={14} /> View Full Photo
                        </button>
                      </div>
                    </div>

                    {/* Footer verification badge */}
                    <div style={{
                      paddingTop: 12,
                      borderTop: "1px solid #EEF2F9",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      fontSize: 12,
                      color: "#64748B",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <Shield size={14} color="#1F9D55" />
                        <span>Official Dialight FA Update</span>
                      </div>
                      <span style={{ fontWeight: 700, color: "#1448A8" }}>Adura Field Ground</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pathway / Registration CTA banner */}
        <div style={{
          background: "linear-gradient(135deg, #0A2352 0%, #1448A8 100%)",
          borderRadius: 20,
          padding: "36px 32px",
          color: "#ffffff",
          boxShadow: "0 16px 36px rgba(10,35,82,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 24,
        }}>
          <div style={{ maxWidth: 620 }}>
            <span style={{
              display: "inline-block",
              background: "rgba(255,255,255,0.15)",
              color: "#FFD700",
              fontWeight: 800,
              fontSize: 11.5,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              padding: "4px 12px",
              borderRadius: 99,
              marginBottom: 10,
            }}>
              Direct Pitchside Updates
            </span>
            <h3 style={{ color: "#fff", fontSize: "clamp(22px, 3vw, 28px)", fontWeight: 800, margin: "0 0 8px" }}>
              Have Questions About Trials, Schedules or Fixtures?
            </h3>
            <p style={{ color: "#C5D6F5", fontSize: 14.5, margin: 0, lineHeight: 1.6 }}>
              Reach out to Coach Imole Tobi and our technical staff directly on WhatsApp or register online for our next open trial session.
            </p>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {onNavigate && (
              <button
                onClick={() => onNavigate("join")}
                style={{
                  padding: "14px 24px",
                  borderRadius: 12,
                  background: "#ffffff",
                  color: "#0A2352",
                  fontWeight: 800,
                  fontSize: 15,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Register for Trials
              </button>
            )}
            <a
              href={COACH_WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "14px 22px",
                borderRadius: 12,
                background: "#25D366",
                color: "#ffffff",
                fontWeight: 800,
                fontSize: 15,
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 8,
                boxShadow: "0 4px 14px rgba(37,211,102,0.3)",
              }}
            >
              <MessageCircle size={18} />
              <span>WhatsApp Coach</span>
            </a>
          </div>
        </div>
      </div>

      {/* ══ Detail Modal ════════════════════════════════════════════════════ */}
      {selectedNews && (() => {
        const modalImgSrc = getCardImage(selectedNews, 0);
        const catStyle = getCategoryStyle(selectedNews.category);
        const isDocAttachment = !!selectedNews.attachmentUrl && !isImageAttachment(selectedNews.attachmentUrl);

        return (
          <div
            onClick={() => setSelectedNews(null)}
            style={{
              position: "fixed", inset: 0, zIndex: 9999,
              background: "rgba(4,12,28,0.85)", backdropFilter: "blur(8px)",
              display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
              animation: "fadeInModal 0.2s ease",
            }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                position: "relative", background: "#fff", borderRadius: 24,
                width: "100%", maxWidth: 640, maxHeight: "90vh", overflowY: "auto",
                boxShadow: "0 32px 80px rgba(0,0,0,0.45)",
                border: "1.5px solid #E2E8F0",
                animation: "slideUpModal 0.24s ease",
              }}
            >
              {/* Close Button top-right */}
              <button
                onClick={() => setSelectedNews(null)}
                style={{
                  position: "absolute", top: 16, right: 16, border: "none",
                  background: "rgba(255,255,255,0.92)", borderRadius: "50%",
                  width: 38, height: 38, display: "grid", placeItems: "center",
                  cursor: "pointer", zIndex: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                }}
              >
                <X size={20} color="#0A2352" />
              </button>

              {/* Hero Image at top of Modal */}
              <div
                style={{
                  position: "relative", width: "100%", aspectRatio: "16 / 9",
                  background: "#0A1A3A", overflow: "hidden", cursor: "zoom-in",
                }}
                onClick={() => setLightboxUrl(modalImgSrc)}
                title="Click to view full photo"
              >
                <img
                  src={modalImgSrc}
                  alt={selectedNews.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div style={{
                  position: "absolute", bottom: 12, right: 14,
                  background: "rgba(0,0,0,0.65)", color: "#fff",
                  borderRadius: 8, padding: "5px 10px", fontSize: 12, fontWeight: 700,
                  display: "flex", alignItems: "center", gap: 5,
                }}>
                  <ZoomIn size={13} /> View Full Picture
                </div>
              </div>

              {/* Modal Body */}
              <div style={{ padding: "30px 28px 26px" }}>
                <span style={{
                  display: "inline-block", fontSize: 12, fontWeight: 800,
                  textTransform: "uppercase", letterSpacing: "0.07em",
                  padding: "5px 14px", borderRadius: 99, marginBottom: 14,
                  background: catStyle.bg, color: catStyle.color,
                }}>
                  {selectedNews.badge || selectedNews.category}
                </span>

                <h3 style={{ fontSize: 23, fontWeight: 900, color: "#0A2352", marginBottom: 16, lineHeight: 1.3 }}>
                  {selectedNews.title}
                </h3>

                {/* Meta details */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 16,
                  fontSize: 13.5, color: "#64748B", marginBottom: 20, flexWrap: "wrap",
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

                {/* Content */}
                {selectedNews.content && (
                  <p style={{ fontSize: 15.5, color: "#334155", lineHeight: 1.8, marginBottom: 24 }}>
                    {selectedNews.content}
                  </p>
                )}

                {/* Document attachment if any */}
                {isDocAttachment && (
                  <a
                    href={resolveMediaUrl(selectedNews.attachmentUrl)}
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

                {/* CTA actions */}
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

      {/* ══ FULL-SCREEN LIGHTBOX — exactly like Alumni section lightbox ══ */}
      {lightboxUrl && (
        <div
          onClick={() => setLightboxUrl(null)}
          style={{
            position: "fixed", inset: 0, zIndex: 10999,
            background: "rgba(4,12,28,0.97)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "16px",
            animation: "fadeInModal 0.2s ease",
          }}
        >
          {/* Close button */}
          <button
            onClick={() => setLightboxUrl(null)}
            style={{
              position: "absolute", top: 18, right: 18,
              background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.22)", color: "#fff",
              borderRadius: "50%", width: 46, height: 46,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", zIndex: 11001,
            }}
            title="Close (Esc)"
          >
            <X size={22} />
          </button>

          {/* Photo container */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              maxWidth: 680, width: "100%",
              animation: "slideUpModal 0.24s ease",
            }}
          >
            <div style={{
              position: "relative", width: "100%", borderRadius: 20,
              overflow: "hidden",
              boxShadow: "0 32px 80px rgba(0,0,0,0.75)",
              border: "2px solid rgba(255,255,255,0.1)",
            }}>
              <img
                src={lightboxUrl}
                alt="Full preview"
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "78vh",
                  objectFit: "contain",
                  display: "block",
                  margin: "0 auto",
                }}
              />
            </div>
          </div>
        </div>
      )}

      <style>{`
        .news-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 24px 50px rgba(10, 35, 82, 0.14) !important;
          border-color: #B9C9EA !important;
        }
        .news-card:hover .news-img {
          transform: scale(1.04);
        }
        @keyframes fadeInModal {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideUpModal {
          from { transform: translateY(22px); opacity: 0; }
          to   { transform: translateY(0);   opacity: 1; }
        }
      `}</style>
    </section>
  );
};
