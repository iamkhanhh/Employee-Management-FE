import React from 'react';
import {
  Grid,
  Box,
  Typography,
  Stack,
  Chip,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
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
      {/* Basic Information */}
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Thông tin cơ bản
        </Typography>
        <Divider sx={{ mb: 2 }} />
      </Grid>

      <Grid item xs={12} md={6}>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <PersonIcon sx={{ mr: 2, mt: 0.5, color: 'text.secondary' }} />
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Họ và tên
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {user.full_name}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <GenderIcon sx={{ mr: 2, mt: 0.5, color: 'text.secondary' }} />
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Giới tính
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {user.gender}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <CakeIcon sx={{ mr: 2, mt: 0.5, color: 'text.secondary' }} />
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Ngày sinh
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {formatDate(user.dob)}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <HomeIcon sx={{ mr: 2, mt: 0.5, color: 'text.secondary' }} />
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Địa chỉ
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {user.address}
              </Typography>
            </Box>
          </Box>
        </Stack>
      </Grid>

      <Grid item xs={12} md={6}>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <PhoneIcon sx={{ mr: 2, mt: 0.5, color: 'text.secondary' }} />
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Số điện thoại
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {user.phone_number}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <ContactPhoneIcon sx={{ mr: 2, mt: 0.5, color: 'text.secondary' }} />
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Liên hệ khẩn cấp
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {user.emergency_name} ({user.emergency_relation})
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.emergency_contact}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <SchoolIcon sx={{ mr: 2, mt: 0.5, color: 'text.secondary' }} />
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Học vấn
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {user.education}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Chuyên ngành: {user.major}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <LanguageIcon sx={{ mr: 2, mt: 0.5, color: 'text.secondary' }} />
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Ngôn ngữ
              </Typography>
              <Stack direction="row" spacing={1}>
                {user.languages.map((lang, index) => (
                  <Chip key={index} label={lang} size="small" variant="outlined" />
                ))}
              </Stack>
            </Box>
          </Box>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default ProfileInfo;