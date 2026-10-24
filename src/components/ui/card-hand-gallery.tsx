"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { Check, type LucideIcon } from "lucide-react";

export interface FanCardItem {
  /** Stable, unique identifier. */
  id: string;
  /** Card title shown on card face and side heading. */
  title: string;
  /** Detailed description shown on the side when this card is active. */
  description?: string;
  /** Optional image URL if ever needed. */
  src?: string;
  /** Subtitle / category tag shown on the card face. */
  tag?: string;
  /** Pill badge in the top right of the card. */
  badge?: string;
  /** Primary metric or stat to display. */
  stat?: string;
  /** Subtitle under the primary metric. */
  statLabel?: string;
  /** Lucide icon component. */
  icon?: LucideIcon;
  /** 2-3 key capability bullet points. */
  features?: readonly string[];
  /** Optional theme accent color. */
  accent?: string;
}

export interface CardHandGalleryProps {
  /** Cards in the hand, in fan order. */
  cards: readonly FanCardItem[];
  /** Active card id. Pass to control the selection yourself. */
  activeId?: string;
  /** Card width in pixels. Height follows a 5:7 ratio. Shrinks to fit narrow containers. */
  cardWidth?: number;
  className?: string;
  /** Initially active card. Defaults to the first card. */
  defaultActiveId?: string;
  /** Fires when a different card is picked. */
  onSelect?: (card: FanCardItem) => void;
}

/** Flick speed, in px/s, that selects a card regardless of how far it travelled. */
const SELECT_VELOCITY = -600;

/** Cards waiting in the hand sit behind the active one, so they ride smaller. */
const HAND_SCALE = 0.72;

/** Spread each card into a symmetric arc around the middle of the hand. */
function fanTransform(index: number, count: number, spacing: number) {
  const offset = index - (count - 1) / 2;
  // The arc keeps a constant total sweep, so a bigger hand fans tighter.
  const stepDeg = count > 1 ? Math.min(9, 46 / (count - 1)) : 0;
  const rotate = offset * stepDeg;

  return {
    rotate,
    x: offset * spacing,
    y: Math.abs(rotate) * 1.9,
  };
}

export function CardHandGallery({
  cards,
  activeId: controlledActiveId,
  cardWidth = 224,
  className,
  defaultActiveId,
  onSelect,
}: CardHandGalleryProps) {
  const shouldReduceMotion = useReducedMotion();
  const fanRef = React.useRef<HTMLDivElement>(null);
  // Set while a pointer drag is in flight so the trailing click is ignored.
  const draggingRef = React.useRef(false);
  const [fanWidth, setFanWidth] = React.useState<number | null>(null);
  const [internalActiveId, setInternalActiveId] = React.useState(
    defaultActiveId ?? cards[0]?.id,
  );
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);
  const [isInitialMount, setIsInitialMount] = React.useState(true);
  // Dragging a card claims the vertical touch axis, which on a phone means
  // swiping over the fan scrolls nothing. Pointer devices only.
  const [canDrag, setCanDrag] = React.useState(false);

  // Fall back to the first card whenever the requested id is not in the hand:
  // a swapped `cards` array, a stale controlled id, a bad `defaultActiveId`.
  // Without this the fan has no card lifted and no side text — an empty state
  // that is otherwise unreachable.
  const requestedId = controlledActiveId ?? internalActiveId;
  const activeId = cards.some((card) => card.id === requestedId)
    ? requestedId
    : cards[0]?.id;
  const activeIndex = cards.findIndex((card) => card.id === activeId);
  const activeCard = cards[activeIndex];

  React.useEffect(() => {
    setIsInitialMount(false);
    setCanDrag(!window.matchMedia("(pointer: coarse)").matches);
  }, []);

  React.useEffect(() => {
    const node = fanRef.current;

    if (!node) {
      return;
    }

    const updateWidth = () => {
      if (node) {
        setFanWidth(node.getBoundingClientRect().width);
      }
    };
    updateWidth();

    const observer = new ResizeObserver(([entry]) => {
      if (entry?.contentRect?.width) {
        setFanWidth(entry.contentRect.width);
      }
    });

    observer.observe(node);
    window.addEventListener("resize", updateWidth);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  // Cards shrink rather than overflow once the column gets narrow.
  const width =
    fanWidth === null ? cardWidth : Math.min(cardWidth, fanWidth * 0.55);

  // Every travel distance scales off the card, so the fan holds together at
  // any width instead of only at the default.
  const height = width * 1.4;
  // Compact bottom clearance to eliminate dead space
  const baseBottom = height * 0.05;
  const hoverLift = height * 0.32;
  const activeLift = height * 0.52;
  const selectDistance = -height * 0.45;

  const handCards = cards.filter((card) => card.id !== activeId);
  const hoveredIndex = hoveredId
    ? handCards.findIndex((card) => card.id === hoveredId)
    : -1;

  // Clamp the horizontal spread so the outermost cards (including their hover
  // scale) never clip against the column edges.
  const maxOffset = (handCards.length - 1) / 2;
  // 0.45 covers half a hand-sized card plus the extra width a 9° tilt adds.
  const halfAvailable =
    fanWidth === null ? Number.POSITIVE_INFINITY : fanWidth / 2 - width * 0.45;
  const fanSpacing =
    maxOffset > 0
      ? Math.min(
          width * (handCards.length > 5 ? 0.43 : 0.52),
          Math.max(width * 0.23, halfAvailable / maxOffset),
        )
      : 0;

  const cardTransition = shouldReduceMotion
    ? { duration: 0.16, ease: "easeOut" as const }
    : {
        damping: 30,
        mass: 0.9,
        stiffness: 340,
        type: "spring" as const,
      };

  const textTransition = { duration: shouldReduceMotion ? 0 : 0.32 };
  const textOffset = shouldReduceMotion ? 0 : 10;

  function clearHover(id: string) {
    setHoveredId((current) => (current === id ? null : current));
  }

  function selectCard(card: FanCardItem) {
    if (card.id === activeId) {
      return;
    }

    clearHover(card.id);

    if (controlledActiveId === undefined) {
      setInternalActiveId(card.id);
    }

    onSelect?.(card);
  }

  const handleTouchMove = React.useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      const touch = e.touches[0];
      if (!touch || !fanRef.current) return;

      const el = document.elementFromPoint(touch.clientX, touch.clientY);
      const cardButton = el?.closest("button[data-card-id]") as HTMLElement | null;
      if (cardButton) {
        const cid = cardButton.getAttribute("data-card-id");
        if (cid && cid !== activeId) {
          setHoveredId(cid);
          return;
        }
      }

      // If finger is slightly between or above cards, float the closest card in hand
      const rect = fanRef.current.getBoundingClientRect();
      const touchX = touch.clientX - (rect.left + rect.width / 2);
      let closestId: string | null = null;
      let closestDist = Number.POSITIVE_INFINITY;
      handCards.forEach((c, idx) => {
        const fan = fanTransform(idx, handCards.length, fanSpacing);
        const dist = Math.abs(touchX - fan.x);
        if (dist < closestDist && dist < width * 0.75) {
          closestDist = dist;
          closestId = c.id;
        }
      });
      if (closestId && closestId !== hoveredId) {
        setHoveredId(closestId);
      }
    },
    [activeId, hoveredId, handCards, fanSpacing, width],
  );

  const handleTouchEnd = React.useCallback(() => {
    if (hoveredId) {
      const cardToSelect = cards.find((c) => c.id === hoveredId);
      if (cardToSelect) {
        selectCard(cardToSelect);
      }
      setHoveredId(null);
    }
  }, [hoveredId, cards]);

  return (
    <div
      className={cn(
        "flex w-full flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-6 lg:gap-8",
        className,
      )}
    >
      <div className="w-full shrink-0 text-center sm:w-60 sm:text-left md:w-68 lg:w-72">
        <h2 className="text-2xl sm:text-3xl lg:text-[40px] font-bold tracking-tight leading-[1.14] text-[#1e1b2e]">
          A human touch.<br />
          <span className="text-[#9393a5]">At a whole new scale.</span>
        </h2>
        {activeCard ? (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={isInitialMount ? false : { opacity: 0, y: textOffset }}
            key={activeCard.id}
            transition={textTransition}
            className="mt-3 sm:mt-4 pt-3 border-t border-purple-100/90 hidden sm:block"
          >
            <span className="text-[10px] uppercase tracking-wider font-bold text-purple-600 block">
              {activeCard.tag || "VirtualVox Agent"}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-[#1e1b2e] leading-snug tracking-tight mt-0.5">
              {activeCard.title}
            </h3>
          </motion.div>
        ) : null}
      </div>

      <div
        className="relative w-full min-w-0 flex-1 touch-pan-y"
        ref={fanRef}
        style={{ minHeight: height * 1.58 }}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {cards.map((card) => {
          const isActive = card.id === activeId;
          const isHovered = card.id === hoveredId;
          const handIndex = handCards.findIndex(
            (candidate) => candidate.id === card.id,
          );

          let slot: { rotate: number; scale: number; x: number; y: number };
          let lift = { rotate: 0, scale: 1, x: 0, y: 0 };
          let zIndex: number;

          if (isActive) {
            slot = { rotate: 0, scale: 1, x: 0, y: -activeLift };
            zIndex = 100;
          } else {
            const fan = fanTransform(handIndex, handCards.length, fanSpacing);
            const neighborShift =
              hoveredIndex !== -1 && !isHovered
                ? (Math.sign(handIndex - hoveredIndex) * width * 0.14) /
                  Math.max(1, Math.abs(handIndex - hoveredIndex))
                : 0;
            const dx = neighborShift;
            const dy = isHovered ? -hoverLift - fan.y : 0;
            const rad = (-fan.rotate * Math.PI) / 180;

            slot = {
              rotate: fan.rotate,
              scale: HAND_SCALE,
              x: fan.x,
              y: fan.y,
            };
            lift = {
              rotate: isHovered ? -fan.rotate * 0.45 : 0,
              scale: isHovered ? 1.08 : 1,
              x: (dx * Math.cos(rad) - dy * Math.sin(rad)) / HAND_SCALE,
              y: (dx * Math.sin(rad) + dy * Math.cos(rad)) / HAND_SCALE,
            };
            zIndex = isHovered ? 60 : 10 + handIndex;
          }

          const CardIcon = card.icon;

          return (
            <motion.div
              animate={slot}
              className="absolute left-1/2"
              initial={false}
              key={card.id}
              onHoverEnd={() => clearHover(card.id)}
              onHoverStart={() => {
                if (!isActive) {
                  setHoveredId(card.id);
                }
              }}
              style={{ bottom: baseBottom, marginLeft: -width / 2, zIndex }}
              transition={cardTransition}
            >
              <motion.div
                animate={lift}
                initial={false}
                transition={cardTransition}
              >
                <motion.button
                  data-card-id={card.id}
                  aria-label={card.title}
                  aria-pressed={isActive}
                  className={cn(
                    "block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2",
                    isActive
                      ? "cursor-default"
                      : "cursor-pointer active:scale-95",
                  )}
                  drag={canDrag && !isActive ? "y" : false}
                  dragConstraints={{ bottom: 0, top: -height * 1.65 }}
                  dragElastic={0.12}
                  dragSnapToOrigin
                  onBlur={() => clearHover(card.id)}
                  onTouchStart={() => {
                    if (!isActive) {
                      setHoveredId(card.id);
                    }
                  }}
                  onTap={() => {
                    if (draggingRef.current) {
                      draggingRef.current = false;
                      return;
                    }
                    selectCard(card);
                  }}
                  onClick={() => {
                    if (draggingRef.current) {
                      draggingRef.current = false;
                      return;
                    }

                    selectCard(card);
                  }}
                  onDragEnd={(_event, info) => {
                    if (
                      info.offset.y < selectDistance ||
                      info.velocity.y < SELECT_VELOCITY
                    ) {
                      selectCard(card);
                    }
                  }}
                  onDragStart={() => {
                    draggingRef.current = true;
                  }}
                  onFocus={() => {
                    if (!isActive) {
                      setHoveredId(card.id);
                    }
                  }}
                  onPointerDown={() => {
                    draggingRef.current = false;
                  }}
                  type="button"
                >
                  {/* Floating ambient levitation wrapper */}
                  <motion.div
                    animate={
                      shouldReduceMotion
                        ? undefined
                        : {
                            y: isActive
                              ? [0, -6, 0]
                              : isHovered
                              ? [0, -4, 0]
                              : [0, -3, 0],
                          }
                    }
                    transition={
                      shouldReduceMotion
                        ? undefined
                        : {
                            duration: isActive
                              ? 3.4
                              : 2.5 + (handIndex >= 0 ? handIndex * 0.35 : 0),
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                          }
                    }
                    className="w-full h-full"
                  >
                    {/* Rich UI Card Face matching VirtualVox Project Niche (Light Theme, No external images) */}
                    <div
                      className={cn(
                        "aspect-[5/7] select-none rounded-2xl border text-left flex flex-col justify-between overflow-hidden relative transition-all duration-300",
                        isActive
                          ? "border-purple-400 bg-gradient-to-br from-[#ffffff] via-[#fdfcff] to-[#f4effc] shadow-[0_20px_50px_-10px_rgba(124,58,237,0.22),0_6px_20px_rgba(100,50,200,0.08),0_0_0_1px_rgba(168,85,247,0.15)] ring-1 ring-purple-300/40"
                          : "border-purple-200/80 bg-gradient-to-br from-[#ffffff] via-[#faf8fe] to-[#f2ebf9] shadow-[0_10px_28px_-6px_rgba(80,50,140,0.1),0_2px_8px_rgba(0,0,0,0.03)] hover:border-purple-400/70 hover:shadow-[0_16px_36px_-6px_rgba(124,58,237,0.16)]",
                      )}
                      style={{ width, padding: Math.max(12, width * 0.07) }}
                    >
                      {/* Glowing Top Sheen & Subtle Ambient Glow */}
                      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent pointer-events-none" />
                      <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-purple-200/40 blur-2xl pointer-events-none" />
                      <div className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full bg-indigo-100/50 blur-2xl pointer-events-none" />

                      {/* Top Row: Icon Box & Category Tag */}
                      <div className="relative z-10 flex items-center justify-between gap-2">
                        <div
                          className={cn(
                            "w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-200",
                            isActive
                              ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-[0_4px_12px_rgba(124,58,237,0.35)]"
                              : "bg-purple-100 text-purple-700 border border-purple-200/80",
                          )}
                        >
                          {CardIcon ? <CardIcon size={17} /> : null}
                        </div>
                        {card.badge && (
                          <span
                            className={cn(
                              "text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 rounded-full border tracking-tight whitespace-nowrap",
                              isActive
                                ? "bg-purple-100/90 text-purple-800 border-purple-200"
                                : "bg-purple-50/70 text-purple-700 border-purple-100",
                            )}
                          >
                            {card.badge}
                          </span>
                        )}
                      </div>

                      {/* Middle Section: Title & Stat Callout */}
                      <div className="relative z-10 my-auto">
                        <span className="text-[8.5px] sm:text-[9.5px] uppercase tracking-wider font-bold text-purple-600 block mb-1">
                          {card.tag || "VirtualVox Agent"}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-[#1e1b2e] tracking-tight leading-snug line-clamp-2">
                          {card.title}
                        </h4>

                        {card.stat && (
                          <div
                            className={cn(
                              "mt-2 p-2 rounded-xl border backdrop-blur-sm transition-colors",
                              isActive
                                ? "bg-purple-50/90 border-purple-200/90 shadow-sm"
                                : "bg-white/85 border-purple-100/80",
                            )}
                          >
                            <div className="text-xs sm:text-sm font-extrabold bg-gradient-to-r from-purple-700 via-indigo-700 to-violet-800 bg-clip-text text-transparent leading-none">
                              {card.stat}
                            </div>
                            {card.statLabel && (
                              <div className="text-[8.5px] sm:text-[9px] text-[#605773] font-medium mt-1 leading-tight">
                                {card.statLabel}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Bottom Section: Features & Watermark */}
                      <div className="relative z-10 pt-2 border-t border-purple-100/90">
                        {card.features && card.features.length > 0 && (
                          <ul className="space-y-1">
                            {card.features.slice(0, 2).map((feat, idx) => (
                              <li
                                key={idx}
                                className="flex items-center gap-1.5 text-[8.5px] sm:text-[9.5px] text-[#423a54] font-medium leading-tight"
                              >
                                <Check
                                  size={10}
                                  className="text-purple-600 shrink-0"
                                />
                                <span className="truncate">{feat}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        <div className="mt-2 flex items-center justify-between text-[7.5px] sm:text-[8px] tracking-[0.18em] font-mono text-purple-400 font-semibold uppercase">
                          <span>AI AGENT</span>
                          <span>VIRTUALVOX</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.button>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      <div
        aria-live="polite"
        className="w-full shrink-0 text-center sm:w-40 sm:text-left md:w-48 lg:w-56"
      >
        {activeCard?.description ? (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={isInitialMount ? false : { opacity: 0, y: textOffset }}
            key={activeCard.id}
            transition={textTransition}
          >
            <p className="text-pretty text-[#5e546f] text-xs sm:text-sm leading-relaxed max-w-sm mx-auto sm:max-w-none">
              {activeCard.description}
            </p>
          </motion.div>
        ) : null}
      </div>
    </div>
  );
}

export default CardHandGallery;
