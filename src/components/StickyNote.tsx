import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import type { Todo, Category, NoteColor } from "../types/todo";
import { NOTE_COLORS } from "../types/todo";
import { NoteActions } from "./NoteActions";

const TILTS = [-1.8, 1.2, -0.6, 2.1, -2.4, 0.9];

function getTilt(id: string): number {
  const sum = Array.from(id).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return TILTS[sum % TILTS.length];
}

interface StickyNoteProps {
  todo: Todo;
  isDeleting: boolean;
  openPopoverId: string | null;
  onPopoverToggle: (id: string | null) => void;
  onMove: (id: string, category: Category) => void;
  onColorChange: (id: string, color: NoteColor) => void;
  onDelete: (id: string) => void;
  onNoteDrag: (x: number, y: number) => void;
  onNoteDrop: (x: number, y: number) => void;
}

export function StickyNote({
  todo,
  isDeleting,
  openPopoverId,
  onPopoverToggle,
  onMove,
  onColorChange,
  onDelete,
  onNoteDrag,
  onNoteDrop,
}: StickyNoteProps) {
  const tilt = getTilt(todo.id);
  const isOpen = openPopoverId === todo.id;
  const controls = useAnimation();
  const prevColor = useRef(todo.color);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Enter animation on mount
  useEffect(() => {
    void controls.start({
      opacity: 1,
      scale: 1,
      rotate: tilt,
      transition: { type: "spring", stiffness: 400, damping: 20 },
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Color pop animation
  useEffect(() => {
    if (prevColor.current !== todo.color) {
      prevColor.current = todo.color;
      void controls.start({
        scale: [1, 1.06, 1],
        transition: { duration: 0.25 },
      });
    }
  }, [todo.color, controls]);

  const isDone = todo.category === "done";

  function handleHoverStart() {
    setIsHovered(true);
    void controls.start({
      rotate: 0,
      scale: 1.02,
      boxShadow: "4px 8px 20px rgba(0,0,0,0.22), 0 2px 6px rgba(0,0,0,0.1)",
      transition: { duration: 0.2 },
    });
  }

  function handleHoverEnd() {
    setIsHovered(false);
    void controls.start({
      rotate: tilt,
      scale: 1,
      boxShadow: "2px 4px 12px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.08)",
      transition: { duration: 0.2 },
    });
  }

  return (
    <motion.div
      layout
      layoutId={todo.id}
      initial={{ opacity: 0, scale: 0.3, rotate: -3 }}
      animate={controls}
      exit={
        isDeleting
          ? {
              opacity: 0,
              scale: 0.6,
              rotate: -40,
              x: -130,
              y: -110,
              transition: { duration: 0.6, ease: [0.4, 0, 0.8, 0.85] },
            }
          : { opacity: 0, transition: { duration: 0.15 } }
      }
      transition={{ type: "spring", stiffness: 280, damping: 28 }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={1}
      dragMomentum={false}
      whileDrag={{ scale: 1.06, zIndex: 200, cursor: "grabbing" }}
      onDragStart={() => {
        setIsDragging(true);
        onPopoverToggle(null);
      }}
      onDrag={(_, info) => onNoteDrag(info.point.x, info.point.y)}
      onDragEnd={(_, info) => {
        setIsDragging(false);
        onNoteDrop(info.point.x, info.point.y);
      }}
      style={{
        transformOrigin: "bottom right",
        position: "relative",
        width: "100%",
        aspectRatio: "1",
        marginBottom: 8,
        cursor: "grab",
      }}
      onHoverStart={isDragging ? undefined : handleHoverStart}
      onHoverEnd={isDragging ? undefined : handleHoverEnd}
    >
      {/* Visible card — overflow hidden so text/tape/fold stay clipped */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: NOTE_COLORS[todo.color],
          borderRadius: 4,
          overflow: "hidden",
          padding: "12px 12px 28px",
          boxShadow: "2px 4px 12px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.08)",
          cursor: "inherit",
        }}
      >
        {/* Tape strip */}
        <div
          style={{
            position: "absolute",
            top: -7,
            left: "50%",
            transform: "translateX(-50%)",
            width: 36,
            height: 14,
            background: "rgba(255,255,255,0.55)",
            borderRadius: 2,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        />
        {/* Corner fold */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: 28,
            height: 28,
            background:
              "linear-gradient(225deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 48%, rgba(0,0,0,0.12) 49%, rgba(0,0,0,0.06) 60%, rgba(255,255,255,0.25) 100%)",
            borderRadius: "0 0 4px 0",
          }}
        />

        {/* Text */}
        <p
          style={{
            fontFamily: "'Caveat', cursive",
            fontSize: 17,
            lineHeight: 1.5,
            color: "#1a1a1a",
            wordBreak: "break-word",
            opacity: isDone ? 0.72 : 1,
            textDecoration: isDone ? "line-through" : "none",
            margin: 0,
          }}
        >
          {todo.text}
        </p>

        {/* Date */}
        <span
          style={{
            position: "absolute",
            bottom: 8,
            left: 14,
            fontSize: 10,
            color: "rgba(0,0,0,0.3)",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {new Date(todo.createdAt).toLocaleDateString()}
        </span>

        {/* Menu button — visible on hover or when popover is open */}
        <button
          type="button"
          className={`note-menu-btn${isOpen || isHovered ? " active" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            onPopoverToggle(isOpen ? null : todo.id);
          }}
          aria-label="Note actions"
        >
          ···
        </button>
      </div>

      {/* Popover — outside the overflow:hidden card so it can extend beyond */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -4 }}
            transition={{ duration: 0.12 }}
            style={{ position: "absolute", top: 34, right: 8, zIndex: 50 }}
            onClick={(e) => e.stopPropagation()}
          >
            <NoteActions
              category={todo.category}
              color={todo.color}
              onMove={(cat) => {
                onMove(todo.id, cat);
                onPopoverToggle(null);
              }}
              onColorChange={(color) => {
                onColorChange(todo.id, color);
                onPopoverToggle(null);
              }}
              onDelete={() => {
                onDelete(todo.id);
                onPopoverToggle(null);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
