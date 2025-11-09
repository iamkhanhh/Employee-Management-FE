import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

const DeleteContractDialog = ({ open, onClose, onConfirm, contractName }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Xóa hợp đồng</DialogTitle>
            <DialogContent>
                <Typography>
                    Bạn có chắc muốn xóa hợp đồng <strong>{contractName}</strong> không?
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Hủy</Button>
                <Button color="error" onClick={onConfirm}>
                    Xóa
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteContractDialog; // ✅ dòng quan trọng
