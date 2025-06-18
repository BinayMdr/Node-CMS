
// material-ui
import { Grid, Stack, Typography } from '@mui/material';

// project import
import AuthForgotPassword from './auth-forms/AuthForgotPassword';
import AuthWrapper from './AuthWrapper';

// ================================|| LOGIN ||================================ //

const ForgotPassword = () => (
  <AuthWrapper>
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
          <Typography variant="h3">Forgot Password</Typography>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <AuthForgotPassword />
      </Grid>
    </Grid>
  </AuthWrapper>
);

export default ForgotPassword;
