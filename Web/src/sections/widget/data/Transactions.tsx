import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Chip,
  Box,
  useTheme,
  alpha,
  TableContainer,
  Tooltip,
  IconButton
} from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';

interface DonationTransaction {
  id: number;
  amount: number;
  currency: string;
  paymentId: string;
  isPaid: boolean;
  createdAt: string;
  isAnonymous: boolean;
  appUserId: string;
  appUser: any;
}

interface TransactionsProps {
  donationsTransactions: DonationTransaction[];
}

const Transactions: React.FC<TransactionsProps> = ({ donationsTransactions }) => {
  const theme = useTheme();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: '2-digit'
    });
    const time = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
    return { date: formattedDate, time };
  };

  return (
    <Card
      elevation={0}
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        '& .MuiCardHeader-root': {
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: alpha(theme.palette.primary.main, 0.03)
        }
      }}
    >
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" fontWeight="600">
              Recent Transactions
            </Typography>
            <Tooltip title="Shows the last 5 transactions">
              <IconButton size="small">
                <InfoIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        }
      />
      <CardContent sx={{ p: 0 }}>
        {donationsTransactions.length === 0 ? (
          <Box
            sx={{
              p: 4,
              textAlign: 'center',
              backgroundColor: alpha(theme.palette.primary.main, 0.02)
            }}
          >
            <Typography variant="body1" color="textSecondary">
              No transactions available.
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, color: theme.palette.text.secondary }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: theme.palette.text.secondary }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: theme.palette.text.secondary }}>Currency</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: theme.palette.text.secondary }}>Payment ID</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: theme.palette.text.secondary }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: theme.palette.text.secondary }}>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {donationsTransactions.slice(0, 5).map((tx) => {
                  const { date, time } = formatDate(tx.createdAt);
                  return (
                    <TableRow
                      key={tx.id}
                      sx={{
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.02)
                        },
                        transition: 'background-color 0.2s ease'
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" fontWeight="500">
                          #{tx.id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="600" color="text.primary">
                          {`R${tx.amount.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}`}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={tx.currency}
                          size="small"
                          sx={{
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
                            fontWeight: 500
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title={tx.paymentId}>
                          <Typography
                            variant="body2"
                            sx={{
                              maxWidth: 120,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {tx.paymentId}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={tx.isPaid ? 'Paid' : 'Pending'}
                          size="small"
                          sx={{
                            backgroundColor: tx.isPaid ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.warning.main, 0.1),
                            color: tx.isPaid ? theme.palette.success.main : theme.palette.warning.main,
                            fontWeight: 500
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="500">
                            {date}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {time}
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default Transactions;
