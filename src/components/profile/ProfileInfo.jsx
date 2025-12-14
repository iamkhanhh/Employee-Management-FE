import React from 'react';
import {
  Grid,
  Box,
  Typography,
  Stack,
  Chip
} from '@mui/material';
import {
  Person as PersonIcon,
  Cake as CakeIcon,
  Wc as GenderIcon,
  Home as HomeIcon,
  Phone as PhoneIcon,
  ContactPhone as ContactPhoneIcon,
  School as SchoolIcon,
  Language as LanguageIcon
} from '@mui/icons-material';
import { formatDate } from '../../utils/dateUtils';

const ProfileInfo = ({ user }) => {
  return (
    <Grid container spacing={3}>

      {/* Left Column */}
      <Grid item xs={12} md={6}>
        <Stack spacing={3}>
          {/* Full Name */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <PersonIcon sx={{ mr: 2, mt: 0.5, color: 'text.secondary' }} />
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Full Name
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {user.fullName}
              </Typography>
            </Box>
          </Box>

          {/* Gender */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <GenderIcon sx={{ mr: 2, mt: 0.5, color: 'text.secondary' }} />
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Gender
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {user.gender}
              </Typography>
            </Box>
          </Box>

          {/* Date of Birth */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <CakeIcon sx={{ mr: 2, mt: 0.5, color: 'text.secondary' }} />
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Date of Birth
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {formatDate(user.dob)}
              </Typography>
            </Box>
          </Box>

          {/* Address */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <HomeIcon sx={{ mr: 2, mt: 0.5, color: 'text.secondary' }} />
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Address
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {user.address}
              </Typography>
            </Box>
          </Box>
        </Stack>
      </Grid>

      {/* Right Column */}
      <Grid item xs={12} md={6}>
        <Stack spacing={3}>
          {/* Phone */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <PhoneIcon sx={{ mr: 2, mt: 0.5, color: 'text.secondary' }} />
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Phone Number
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {user.phoneNumber}
              </Typography>
            </Box>
          </Box>


        </Stack>
      </Grid>

    </Grid>
  );
};

export default ProfileInfo;
