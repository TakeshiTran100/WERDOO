import React from 'react';
import { useStoryStore } from '../store';
import Sortable from 'sortablejs';
import shelfImg from '../assets/cai ke_1.png';
import bookImg from '../assets/Book_1.png';
import editIcon from '../assets/edit icon.png';

const ShelfRow = ({ label, storyList, hoveredBook, setHoveredBook, handleWriteStory, handleOpenEdit, onExpandAll }) => {
  const [tooltipData, setTooltipData] = React.useState(null); // { x, y, story }
  const SHELF_LIMIT = 7;
  const [expanded, setExpanded] = React.useState(false);
  const overflow = Math.max(0, storyList.length - SHELF_LIMIT);
  const visibleBooks = expanded ? storyList : storyList.slice(0, SHELF_LIMIT);
  const scrollRef = React.useRef(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const dragStart = React.useRef({ x: 0, scrollLeft: 0 });
  const [draggedId, setDraggedId] = React.useState(null);
  const [dragOverId, setDragOverId] = React.useState(null);
  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handler = (e) => e.preventDefault();
    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, []);

  const onMouseDown = (e) => { const el = scrollRef.current; if (!el) return; setIsDragging(true); dragStart.current = { x: e.pageX, scrollLeft: el.scrollLeft }; el.style.cursor = 'grabbing'; };
  const onMouseMove = (e) => { if (!isDragging) return; const el = scrollRef.current; if (!el) return; el.scrollLeft = dragStart.current.scrollLeft - (e.pageX - dragStart.current.x); };
  const onMouseUp = () => { setIsDragging(false); if (scrollRef.current) scrollRef.current.style.cursor = 'grab'; };
  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const sortable = Sortable.create(el, {
      animation: 150,
      ghostClass: 'sortable-ghost',
      chosenClass: 'sortable-chosen',
      dragClass: 'sortable-drag',
      onEnd: (evt) => {
        const arr = [...storyList];
        const [moved] = arr.splice(evt.oldIndex, 1);
        arr.splice(evt.newIndex, 0, moved);
        useStoryStore.getState().setStories(arr);
      },
    });
    return () => sortable.destroy();
  }, [storyList]);

  return (
    <div className="mb-10" style={{ marginTop: 'px', overflow: 'visible' }}>
      <div className="flex items-baseline gap-4 mb-4">
        <p className="text-2xl font-bold" style={{ color: '#DD7E83', letterSpacing: 2, fontFamily: "'Be Vietnam Pro', sans-serif" }}>{label.toUpperCase()}</p>
        {(overflow > 0 || expanded) && (
          <span
            onMouseDown={e => e.stopPropagation()}
            onClick={() => {
              if (overflow > 0 && onExpandAll) {
                onExpandAll();
              } else {
                setExpanded(v => !v);
              }
            }}
            style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600, fontSize: 13, color: '#DD7E83', opacity: 0.6, cursor: 'pointer', letterSpacing: 0.3, borderBottom: '1px solid transparent', transition: 'opacity 0.2s, border-color 0.2s', userSelect: 'none', zIndex: 50, position: 'relative' }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.borderBottomColor = '#DD7E83'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '0.6'; e.currentTarget.style.borderBottomColor = 'transparent'; }}>
            {expanded ? 'Thu gọn ←' : `+${overflow} truyện khác →`}
          </span>
        )}
      </div>
      <div style={{ position: 'relative', overflow: 'visible', marginTop: -122 }}>
        <div
          ref={scrollRef}
          className="flex pb-2 items-end"
          style={{
            gap: 'clamp(42px, 4vw, 40px)',
            overflowX: 'hidden',
            overflowY: 'visible',
            position: 'relative',
            zIndex: 20,
            paddingLeft: 80,
            paddingRight: 8,
            transition: 'opacity 0.3s ease',
            justifyContent: 'flex-start',
            minHeight: 340,
            alignItems: 'flex-end',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
          onWheel={e => e.preventDefault()}
          onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
        >
          {storyList.length === 0 ? (
            <div className="flex items-center justify-center w-full h-32" style={{ color: '#DD7E83', fontFamily: "'Be Vietnam Pro', sans-serif" }}>Chưa có truyện nào</div>
          ) : (
            visibleBooks.map((story, index) => {
              const isHovered = hoveredBook?.id === story.id;
              const isFaded = hoveredBook && !isHovered;
              return (
                <div key={story.id} className="flex-shrink-0 flex flex-col items-center"
                  style={{
                    width: 160, position: 'relative', overflow: 'visible',
                    transition: 'opacity 0.4s cubic-bezier(0.22,1,0.36,1) 120ms',
                    opacity: isFaded ? 0.88 : 1,
                  }}
                  onMouseEnter={(e) => { setHoveredBook(story); const r = e.currentTarget.getBoundingClientRect(); setTooltipData({ story, x: r.left + r.width / 500, y: r.bottom + 0 }); }}
                  onMouseLeave={() => { setHoveredBook(null); setTooltipData(null); }}>
                  <div className="cursor-pointer"
                    style={{ width: 160, height: 212, marginBottom: '-25px', transition: 'transform 0.35s cubic-bezier(0.22,1,0.36,1)', transform: isHovered ? 'translateY(-13px) rotate(-0.7deg) scale(1.02)' : 'translateY(0) rotate(0deg) scale(1)', position: 'relative', zIndex: 30 }}
                    onClick={() => handleWriteStory(story)}>
                    <svg viewBox="0 0 160 212"
                      style={{
                        position: 'absolute',
                        top: 16.5,
                        left: 22,
                        right: 9.5,
                        bottom: 5,
                        width: 'auto',
                        height: 'auto',
                        zIndex: 1
                      }}
                      xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <filter id="bookShadow"
                          x="-20%"
                          y="-20%"
                          width="140%"
                          height="140%">
                          <feDropShadow dx="3" dy="6" stdDeviation="6" floodColor="rgba(0,0,0,0.25)" />
                        </filter>
                      </defs>
                      <rect x="0" y="0" width="160" height="212" rx="2" ry="2" fill="#F2C975" filter="url(#bookShadow)" />
                    </svg>
                    {story.coverImage && (
                      <img src={story.coverImage} alt="cover" style={{ position: 'absolute', top: 17, left: 22, right: 0, bottom: 16, width: '80%', objectFit: 'cover', zIndex: 2, borderRadius: 0, opacity: 0.92 }} />
                    )}
                    <img src={editIcon} alt="edit"
                      onClick={e => { e.stopPropagation(); handleOpenEdit(story); }}
                      style={{ position: 'absolute', width: 22, height: 22, right: -20, top: 16, zIndex: 35, opacity: isHovered ? 1 : 0, transition: 'opacity 0.2s' }} />
                  </div>
                </div>
              );
            })
          )}
        </div>
        {tooltipData && (
          <div style={{ position: 'fixed', left: tooltipData.x - 255, top: tooltipData.y + -260, zIndex: 99999, whiteSpace: 'nowrap', background: 'rgba(253,246,240,0.97)', border: '1px solid #e8c8c8', borderRadius: 10, padding: '8px 14px', pointerEvents: 'none', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
            <p style={{ fontWeight: 700, fontSize: 13, color: '#9b2335', marginBottom: 2 }}>{tooltipData.story.title}</p>
            <p style={{ fontSize: 11, color: '#DD7E83' }}>Chap {tooltipData.story.chapters || 0} • {tooltipData.story.wordCount || 0} từ</p>
          </div>
        )}
        <img src={shelfImg} alt="shelf" className="w-full" style={{ marginTop: '-8px', position: 'relative', zIndex: 25, height: 45, objectFit: 'fill' }} />
      </div>

    </div>
  );
};

export default ShelfRow;