import React, { useState } from 'react';
import {
    Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TablePagination,
  TableSortLabel,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Contact } from '../lib/types';

interface ContactTableProps {
  contacts: Contact[];
  onDelete: (id: string) => void;
  onEdit: (contact: Contact) => void;
}

type Order = 'asc' | 'desc';

export default function ContactTable({ contacts, onDelete, onEdit }: ContactTableProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState<keyof Contact>('lastName');
  const [order, setOrder] = useState<Order>('asc');

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (property: keyof Contact) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedContacts = [...contacts].sort((a, b) => {
    if (order === 'asc') {
      return a[orderBy] < b[orderBy] ? -1 : 1;
    } else {
      return b[orderBy] < a[orderBy] ? -1 : 1;
    }
  });

  const paginatedContacts = sortedContacts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const headerCellStyle = {
    fontWeight: 'bold',
    backgroundColor: '#f5f5f5',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    padding: '16px 8px',
  };
  
  const bodyCellStyle = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    padding: '12px 8px',
    '&:hover': {
      overflow: 'visible',
      whiteSpace: 'normal',
      backgroundColor: 'white',
      position: 'relative',
      zIndex: 1,
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      minHeight: '100%',
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <TableContainer>
        <Table sx={{ tableLayout: 'fixed' }}> {/* This ensures fixed column widths */}
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell width="14%" sx={headerCellStyle}>
                <TableSortLabel
                  active={orderBy === 'firstName'}
                  direction={orderBy === 'firstName' ? order : 'asc'}
                  onClick={() => handleSort('firstName')}
                >
                  First Name
                </TableSortLabel>
              </TableCell>
              <TableCell width="14%" sx={headerCellStyle}>
                <TableSortLabel
                  active={orderBy === 'lastName'}
                  direction={orderBy === 'lastName' ? order : 'asc'}
                  onClick={() => handleSort('lastName')}
                >
                  Last Name
                </TableSortLabel>
              </TableCell>
              <TableCell width="18%" sx={headerCellStyle}>Email</TableCell>
              <TableCell width="14%" sx={headerCellStyle}>Phone</TableCell>
              <TableCell width="14%" sx={headerCellStyle}>Company</TableCell>
              <TableCell width="14%" sx={headerCellStyle}>Job Title</TableCell>
              <TableCell width="12%" sx={headerCellStyle}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedContacts.map((contact) => (
              <TableRow 
                key={contact.id}
                sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}
              >
                <TableCell sx={bodyCellStyle}>{contact.firstName}</TableCell>
                <TableCell sx={bodyCellStyle}>{contact.lastName}</TableCell>
                <TableCell sx={bodyCellStyle}>{contact.email}</TableCell>
                <TableCell sx={bodyCellStyle}>{contact.phoneNumber}</TableCell>
                <TableCell sx={bodyCellStyle}>{contact.company}</TableCell>
                <TableCell sx={bodyCellStyle}>{contact.jobTitle}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton 
                      onClick={() => onEdit(contact)} 
                      color="primary"
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      onClick={() => onDelete(contact.id)} 
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={contacts.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ mt: 2 }}
      />
    </Paper>
  );
}