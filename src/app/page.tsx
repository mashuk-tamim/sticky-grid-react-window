"use client";

import React, {
  createContext,
  forwardRef,
  ReactNode,
  CSSProperties,
  useContext,
} from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeGrid, GridChildComponentProps } from "react-window";

interface StickyRow {
  height: number;
  width: number;
  top: number;
  label: string;
}

interface StickyHeader {
  height: number;
  width: number;
  left: number;
  label: string;
}

interface TableGridContextType {
  stickyWidth: number;
  columnWidth: number;
  rowHeight: number;
  stickyHeight: number;
  rowCount: number;
  columnCount: number;
}

interface StickyColumnsProps {
  rows: StickyRow[];
}

interface StickyHeaderProps {
  columns: StickyHeader[];
}
interface TableGridProps {
  stickyWidth: number;
  columnWidth: number;
  rowHeight: number;
  stickyHeight: number;
  height: number;
  width: number;
  columnCount: number;
  rowCount: number;
  children: React.FC<GridChildComponentProps>;
}

interface InnerGridElementTypeProps {
  children: ReactNode[];
  style?: CSSProperties;
}
const TableGridContext = createContext<TableGridContextType | undefined>(
  undefined
);
TableGridContext.displayName = "TableGridContext";

const InnerGridElementType = forwardRef<
  HTMLDivElement,
  InnerGridElementTypeProps
>(({ children, style, ...rest }, ref) => {
  const context = useContext(TableGridContext);

  const {
    stickyWidth,
    rowCount,
    columnCount,
    rowHeight,
    stickyHeight,
    columnWidth,
  } = context!;

  const stickyRows = createStickyColumn(rowCount, stickyWidth, rowHeight);

  const stickyHeaders = createStickyRow(columnCount, columnWidth, stickyHeight);

  const containerStyle: CSSProperties = {
    ...style,
    position: "relative",
  };

  const gridDataContainerStyle: CSSProperties = {
    position: "absolute",
    top: stickyHeight,
    left: stickyWidth,
  };

  return (
    <div ref={ref} style={containerStyle} {...rest}>
      <StickyHeader columns={stickyHeaders} />
      <StickyColumns rows={stickyRows} />
      <div style={gridDataContainerStyle}>{children}</div>
    </div>
  );
});
InnerGridElementType.displayName = "InnerGridElementType";

const TableGrid: React.FC<TableGridProps> = ({
  stickyWidth,
  columnWidth,
  rowHeight,
  stickyHeight,
  rowCount,
  columnCount,
  children,
  ...rest
}) => {
  return (
    <TableGridContext.Provider
      value={{
        stickyWidth,
        columnWidth,
        rowHeight,
        stickyHeight,
        rowCount,
        columnCount,
      }}
    >
      <FixedSizeGrid
        columnWidth={columnWidth}
        rowHeight={rowHeight}
        rowCount={rowCount}
        columnCount={columnCount}
        innerElementType={InnerGridElementType}
        overscanRowCount={100}
        overscanColumnCount={100}
        {...rest}
      >
        {children}
      </FixedSizeGrid>
    </TableGridContext.Provider>
  );
};

const GridCell = ({
  rowIndex,
  columnIndex,
  style,
}: GridChildComponentProps) => {
  const columnStyle: CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
    borderRight: "1px solid gray",
    borderBottom: "1px solid gray",
    backgroundColor: "white",
    color: "black",
    ...style,
  };
  return <div style={columnStyle}>{`Cell ${rowIndex}, ${columnIndex}`}</div>;
};

export default function StickyTableGrid() {
  const rowCount = 1000;
  const columnCount = 1000;
  const rowHeight = 30;
  const columnWidth = 120;
  const stickyWidth = 150;
  const stickyHeight = 50;
  return (
    <div
      style={{
        fontFamily: "sans-serif",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontSize: "24px",
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        Sticky Table Grid Example
      </h1>
      <AutoSizer>
        {({ width }) => (
          <TableGrid
            width={width}
            height={500}
            columnCount={columnCount}
            rowCount={rowCount}
            rowHeight={rowHeight}
            stickyHeight={stickyHeight}
            columnWidth={columnWidth}
            stickyWidth={stickyWidth}
          >
            {GridCell}
          </TableGrid>
        )}
      </AutoSizer>
    </div>
  );
}

const StickyColumns: React.FC<StickyColumnsProps> = ({ rows }) => {
  const context = useContext(TableGridContext);

  const { stickyHeight } = context!;
  const containerStyle: CSSProperties = {
    position: "sticky",
    left: 0,
    zIndex: 2,
    width: "min-content",
    height: "100%",
    backgroundColor: "lightblue",
    top: stickyHeight,
  };

  return (
    <div style={containerStyle}>
      {rows.map(({ label, height, width, top }, i) => {
        const rowStyle: CSSProperties = {
          position: "absolute",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          paddingLeft: 10,
          borderBottom: "1px solid gray",
          borderRight: "1px solid gray",
          backgroundColor: "white",
          color: "black",
          height,
          width,
          top,
        };
        return (
          <div key={i}>
            <div style={rowStyle}>{label}</div>
          </div>
        );
      })}
    </div>
  );
};
const StickyHeader: React.FC<StickyHeaderProps> = ({ columns }) => {
  const context = useContext(TableGridContext);

  const { stickyHeight, stickyWidth } = context!;
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        left: 0,
        display: "flex",
        flexDirection: "row",
        zIndex: 3,
        backgroundColor: "white",
        color: "black",
        height: stickyHeight,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          position: "sticky",
          zIndex: 4,
          top: 0,
          left: 0,
          backgroundColor: "white",
          width: stickyWidth,
          height: stickyHeight,
          flexShrink: 0,
          borderBottom: "1px solid gray",
          borderRight: "1px solid gray",
        }}
      />
      {columns.map(({ label, height, width }, i) => {
        const headerStyle: CSSProperties = {
          position: "relative",
          flex: 1,
          backgroundColor: "white",
          color: "black",
          height,
          width,
          borderBottom: "1px solid gray",
          borderRight: "1px solid gray",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          paddingLeft: 10,
        };
        return (
          <div key={i}>
            <div style={headerStyle}>{label}</div>
          </div>
        );
      })}
    </div>
  );
};

const createStickyColumn = (
  rowCount: number,
  stickyWidth: number,
  rowHeight: number
) => {
  const rows = [];
  let currentTop = 0;

  for (let i = 0; i < rowCount; i++) {
    rows.push({
      height: rowHeight,
      width: stickyWidth,
      top: currentTop,
      label: `Sticky Row ${i}`,
      rowIndexNumber: i,
    });
    currentTop += rowHeight;
  }

  return rows;
};
const createStickyRow = (
  columnCount: number,
  columnWidth: number,
  stickyHeight: number
) => {
  const columns = [];
  let currentLeft = 0;

  for (let i = 0; i < columnCount; i++) {
    columns.push({
      height: stickyHeight,
      width: columnWidth,
      left: currentLeft,
      label: `Sticky Col ${i}`,
    });
    currentLeft += columnWidth;
  }

  return columns;
};
