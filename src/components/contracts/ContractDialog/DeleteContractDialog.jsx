import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

const DeleteContractDialog = ({ open, onClose, onConfirm, contractName }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Delete Contract</DialogTitle>
            <DialogContent>
                <Typography>
                    Are you sure you want to delete the contract <strong>{contractName}</strong>?
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button color="error" onClick={onConfirm}>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteContractDialog; // ✅ dòng quan trọng
