"use client";

import { useRef} from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

const StickyTableGrid = () => {
  const rowCount = 1000;
  const columnCount = 1000;
  const rowHeight = 30;
  const columnWidth = 120;
  const stickyWidth = 150;
  const stickyHeight = 50;

  const containerHeight = 500;

  // Single scroll element for everything
  const scrollElementRef = useRef(null);

  // Row virtualizer
  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => scrollElementRef.current,
    estimateSize: () => rowHeight,
    overscan: 0,
  });

  // Column virtualizer
  const columnVirtualizer = useVirtualizer({
    count: columnCount,
    getScrollElement: () => scrollElementRef.current,
    estimateSize: () => columnWidth,
    horizontal: true,
    overscan: 0,
  });

  // Memoize virtual items to prevent unnecessary recalculations
  const virtualRows = rowVirtualizer.getVirtualItems();
  const virtualColumns = columnVirtualizer.getVirtualItems();

  const totalRowSize = rowVirtualizer.getTotalSize()
  const totalColumnSize = columnVirtualizer.getTotalSize();

  return (
    <div
      style={{
        fontFamily: "sans-serif",
        textAlign: "center",
        paddingTop: "20px",
      }}
    >
      <h1
        style={{
          fontSize: "24px",
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        Sticky Table Grid Using TanStack Virtualizer
      </h1>

      <div
        style={{
          width: "100vw",
          height: containerHeight,
          position: "relative",
          margin: "0 auto",
        }}
      >
        {/* Single scroll container that contains everything */}
        <div
          ref={scrollElementRef}
          style={{
            width: "100%",
            height: "100%",
            overflow: "auto",
            position: "relative",
          }}
        >
          {/* Main content area - this creates the scrollable space */}
          <div
            style={{
              position: "relative",
              height: totalRowSize + stickyHeight,
              width: totalColumnSize + stickyWidth,
            }}
          >
            {/* Sticky Header - positioned absolutely within scroll container */}
            <div
              style={{
                position: "sticky",
                top: 0,
                left: 0,
                right: 0,
                height: stickyHeight,
                zIndex: 3,
                backgroundColor: "white",
                display: "flex",
              }}
            >
              {/* Top-left corner cell */}
              <div
                style={{
                  position: "sticky",
                  left: 0,
                  width: stickyWidth,
                  height: stickyHeight,
                  backgroundColor: "white",
                  borderRight: "1px solid gray",
                  borderBottom: "1px solid gray",
                  flexShrink: 0,
                  zIndex: 4,
                }}
              />

              {/* Header columns */}
              <div
                style={{
                  position: "relative",
                  display: "flex",
                }}
              >
                {virtualColumns.map((virtualColumn) => (
                  <div
                    key={virtualColumn.key}
                    style={{
                      position: "absolute",
                      left: virtualColumn.start,
                      width: virtualColumn.size,
                      height: stickyHeight,
                      backgroundColor: "white",
                      borderRight: "1px solid gray",
                      borderBottom: "1px solid gray",
                      display: "flex",
                      alignItems: "center",
                      paddingLeft: 10,
                      color: "black",
                    }}
                  >
                    Sticky Col {virtualColumn.index}
                  </div>
                ))}
              </div>
            </div>

            {/* Sticky Column */}
            <div
              style={{
                position: "sticky",
                top: stickyHeight,
                left: 0,
                bottom: 0,
                width: stickyWidth,
                zIndex: 2,
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: stickyWidth,
                  height: totalRowSize,
                }}
              >
                {virtualRows.map((virtualRow) => (
                  <div
                    key={virtualRow.key}
                    style={{
                      position: "absolute",
                      top: virtualRow.start,
                      left: 0,
                      width: stickyWidth,
                      height: virtualRow.size,
                      backgroundColor: "white",
                      borderBottom: "1px solid gray",
                      borderRight: "1px solid gray",
                      display: "flex",
                      alignItems: "center",
                      paddingLeft: 10,
                      color: "black",
                    }}
                  >
                    Sticky Row {virtualRow.index}
                  </div>
                ))}
              </div>
            </div>

            {/* Main grid cells */}
            <div
              style={{
                position: "absolute",
                top: stickyHeight,
                left: stickyWidth,
                height: totalRowSize,
                width: totalColumnSize,
              }}
            >
              {virtualRows.map((virtualRow) =>
                virtualColumns.map((virtualColumn) => (
                  <div
                    key={`${virtualRow.key}-${virtualColumn.key}`}
                    style={{
                      position: "absolute",
                      top: virtualRow.start,
                      left: virtualColumn.start,
                      width: virtualColumn.size,
                      height: virtualRow.size,
                      backgroundColor: "white",
                      borderRight: "1px solid gray",
                      borderBottom: "1px solid gray",
                      display: "flex",
                      alignItems: "center",
                      paddingLeft: 10,
                      color: "black",
                    }}
                  >
                    Cell {virtualRow.index}, {virtualColumn.index}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickyTableGrid;
