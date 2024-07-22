import { Box, Grid } from "@mui/material";

export const DashboardPage = () => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      width="100vw"
    >
      <Grid container maxWidth="800px" p={2} spacing={2}>
        <Grid item xs={8}>
          <div>xs=8、アーキテクチャ図だよ</div>
        </Grid>
        <Grid item xs={4}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <div>アンケート結果だよ</div>
            </Grid>
            <Grid item xs={6}>
              <div>アンケート結果だよ</div>
            </Grid>
            <Grid item xs={6}>
              <div>アンケート結果だよ</div>
            </Grid>
            <Grid item xs={6}>
              <div>アンケート結果だよ</div>
            </Grid>
            <Grid item xs={6}>
              <div>アンケート結果だよ</div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};
