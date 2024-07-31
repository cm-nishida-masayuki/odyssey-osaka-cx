/* eslint-disable react-hooks/exhaustive-deps */
import { Box } from "@mui/material";
import { PieChart } from "@mui/x-charts";
import { CSSProperties, useMemo } from "react";
import { useQuestionnaireAnswers } from "../hooks/useQuestionnaireAnswers";
import { useQuestionnaireEvent } from "../hooks/useQuestionnaireEvent";
import { Questionnaire, useQuestionnaires } from "../hooks/useQuestionnaires";

export const DashboardPage = () => {
  const [{ data, error, isLoading }] = useQuestionnaires();

  const headerHeight = 80;
  const gap = 16;
  const bottomMargin = 32;
  const cellSize = `calc((100vh - ${headerHeight}px - ${gap * 3}px - ${bottomMargin}px) / 4)`;
  const miniCellSize = `calc(((100vh - ${headerHeight}px - ${gap * 3}px - ${bottomMargin}px) / 4 - 16px) / 2) `;

  const cellStyle: CSSProperties = {
    backgroundColor: "white",
    border: "0.5px solid black",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "black",
    fontSize: "1.5rem",
  };

  const logoImages = [
    "./amazon_api_gateway.png",
    "./cloudfront.png",
    "./dynamodb.jpeg",
    "./lambda.png",
    "./amazon_bedrock.png",
    "./s3.jpeg",
    "./electrodb.png",
    "./lang_chain.png",
    "./tittan.png",
    "./pinecone.jpeg",
    "./claude_3_hjaiku.jpeg",
    "./react.png",
    "./vite.svg",
    "./mui.png",
  ];

  const renderCells = (startIndex: number, endIndex: number) => {
    return Array.from({ length: endIndex - startIndex + 1 }, (_, i) => {
      const index = startIndex + i;
      return (
        <DashboardQuestionnaireCell
          key={index}
          questionnaire={data?.questionnaires?.[index]}
          isLoading={isLoading}
          error={error}
        />
      );
    });
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#F5F5F5",
      }}
    >
      <header
        style={{
          height: `${headerHeight}px`,
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
        }}
      >
        <h1
          style={{
            color: "#5C5B64",
            fontWeight: "bold",
            fontSize: "1.75rem",
            margin: 0,
          }}
        >
          Classmethod Odyssey
        </h1>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `1fr ${cellSize} ${cellSize} ${cellSize}`,
          gridTemplateRows: `repeat(3, ${cellSize}) ${cellSize} ${cellSize}`,
          gap: `${gap}px`,
          height: `calc(100vh - ${headerHeight}px - ${bottomMargin}px)`,
          padding: `${gap}px`,
          paddingBottom: `${gap + bottomMargin}px`,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            ...cellStyle,
            gridColumn: "1 / 2",
            gridRow: "1 / 4",
            padding: "8px",
          }}
        >
          <img
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
            src="./architecture.png"
            alt=""
          />
        </div>

        {renderCells(0, 8)}
        <div
          style={{
            gridColumn: "1 / 2",
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: `1fr ${miniCellSize} ${miniCellSize} ${miniCellSize} ${miniCellSize} ${miniCellSize} ${miniCellSize} ${miniCellSize}`,
              gridTemplateRows: `${miniCellSize} ${miniCellSize}`,
              gap: "16px",
            }}
          >
            <Box
              sx={{
                ...cellStyle,
                gridRow: "span 2",
              }}
            >
              <section
                style={{
                  fontSize: "1.2rem",
                }}
              >
                <h2
                  style={{
                    fontSize: "1.2rem",
                    margin: 0,
                  }}
                >
                  このアプリのポイント
                </h2>
                <ul>
                  <li>有志で通常業務しながら２週間で作成</li>
                  <li>アンケート、コメントはWebSocket通信</li>
                  <li>全てサーバーレス</li>
                  <li>セッション検索は生成AI(ナレッジベース)</li>
                </ul>
              </section>
            </Box>
            {Array.from({ length: 15 }, (_, index) => (
              <Box
                key={index}
                sx={{
                  ...cellStyle,
                }}
              >
                <img
                  src={logoImages[index]}
                  alt=""
                  style={{
                    height: "72%",
                    width: "72%",
                  }}
                />
              </Box>
            ))}
          </Box>
        </div>
        {renderCells(9, 11)}
      </div>
    </div>
  );
};

type Props = {
  questionnaire: Questionnaire | undefined;
  isLoading: boolean;
  error: unknown;
};

const DashboardQuestionnaireCell = ({
  questionnaire,
  isLoading: parentIsLoading,
  error: parentError,
}: Props) => {
  const cellStyle: CSSProperties = {
    backgroundColor: "white",
    border: "0.5px solid black",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "black",
    padding: "10px",
    height: "100%",
    width: "100%",
  };

  const colors = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
    "#FF5A5E",
    "#5AD3D1",
    "#A8E6CF",
    "#FFD3B6",
    "#FF8A80",
    "#82B1FF",
    "#B39DDB",
    "#FFCC80",
    "#81C784",
  ];

  const [{ data, isLoading, error }] = useQuestionnaireAnswers({
    questionnaireId: questionnaire?.id ?? 0,
  });

  const { data: newData } = useQuestionnaireEvent({
    questionnaireId: questionnaire?.id?.toString() ?? "0",
  });

  const choiceCounts = useMemo(() => {
    if (data == null) {
      return null;
    }

    const allAnswers = [...data.answers, ...(newData?.answers || [])];

    return allAnswers.reduce(
      (acc, curr) => {
        acc[curr.choice] = (acc[curr.choice] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
  }, [newData, data]);

  const graphData = useMemo(() => {
    if (choiceCounts == null) {
      return [];
    }

    return Object.entries(choiceCounts)
      .map(([key, value]) => ({
        value,
        label: key,
      }))
      .sort((a, b) => b.value - a.value);
  }, [choiceCounts]);

  const getShiftedColors = useMemo(() => {
    if (!questionnaire) return colors;
    const shiftAmount = (questionnaire.id + 2) % colors.length;
    return [...colors.slice(shiftAmount), ...colors.slice(0, shiftAmount)];
  }, [colors, questionnaire]);

  if (!questionnaire || parentIsLoading || isLoading) {
    return <div style={cellStyle}>Loading...</div>;
  }

  if (parentError || error) {
    return <div style={cellStyle}>Error</div>;
  }

  return (
    <div style={cellStyle}>
      <h3
        style={{
          fontSize: "16px",
          fontWeight: "500",
          textAlign: "left",
          width: "100%",
          margin: 0,
          lineHeight: "18px",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        }}
      >
        {questionnaire.title}
      </h3>
      {graphData.length > 0 ? (
        <>
          <PieChart
            colors={getShiftedColors}
            series={[
              {
                data: graphData,
                innerRadius: 0,
                outerRadius: 55,
                cx: 65,
                cy: 30,
              },
            ]}
            width={140}
            height={60}
            slotProps={{
              legend: {
                hidden: true,
              },
            }}
          />
          <CustomLabel data={graphData} colors={getShiftedColors} />
        </>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: "100%",
          }}
        >
          No Data
        </div>
      )}
    </div>
  );
};

type CustomLabelProps = {
  data: Array<{ label: string; value: number }>;
  colors: string[];
};

const CustomLabel: React.FC<CustomLabelProps> = ({ data, colors }) => (
  <div
    style={{
      display: "flex",
      fontSize: "14px",
      width: "100%",
      marginTop: "5px",
      gap: "6px",
    }}
  >
    {data.slice(0, 2).map((item, index) => (
      <div
        key={index}
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            backgroundColor: colors[index % colors.length],
            marginRight: 4,
            flexShrink: 0,
          }}
        />
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {item.label}
        </div>
      </div>
    ))}
  </div>
);
