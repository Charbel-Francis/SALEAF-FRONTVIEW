import { useMemo, useState, Fragment, MouseEvent, useEffect } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import axios from 'utils/axios';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import capitalize from '@mui/utils/capitalize';

import {
  ColumnDef,
  HeaderGroup,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
  useReactTable,
  SortingState,
  FilterFn
} from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils';

// project-import
import ScrollX from 'components/ScrollX';
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import {
  DebouncedInput,
  HeaderSort,
  IndeterminateCheckbox,
  RowSelection,
  SelectColumnSorting,
  TablePagination
} from 'components/third-party/react-table';

import { APP_DEFAULT_PATH } from 'config';

// types
import { LabelKeyObject } from 'react-csv/lib/core';

// assets
import { Add, Edit, Eye, Trash } from 'iconsax-react';
import EventView from 'sections/apps/event/event-list/EventView';
import { Event, Package } from 'types/event';
import { Grid } from '@mui/material';

export const fuzzyFilter: FilterFn<Event> = (row, columnId, value, addMeta) => {
  // rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // store the ranking info
  addMeta(itemRank);

  // return if the item should be filtered in/out
  return itemRank.passed;
};

interface Props {
  columns: ColumnDef<Event>[];
  data: Event[];
}

// ==============================|| REACT TABLE - LIST ||============================== //

function ReactTable({ data, columns }: Props) {
  const theme = useTheme();

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'eventId',
      desc: false
    }
  ]);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      rowSelection,
      globalFilter
    },
    enableRowSelection: true,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getRowCanExpand: () => true,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    globalFilterFn: fuzzyFilter,
    debugTable: true
  });

  const backColor = alpha(theme.palette.primary.lighter, 0.1);
  let headers: LabelKeyObject[] = [];
  columns.map(
    (columns) =>
      // @ts-ignore
      columns.accessorKey &&
      headers.push({
        label: typeof columns.header === 'string' ? columns.header : '#',
        // @ts-ignore
        key: columns.accessorKey
      })
  );

  const history = useNavigate();

  const handleAddEvent = () => {
    history(`/apps/event/add-new-event`);
  };

  return (
    <MainCard content={false}>
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ p: 3 }}>
        <DebouncedInput
          value={globalFilter ?? ''}
          onFilterChange={(value) => setGlobalFilter(String(value))}
          placeholder={`Search ${data.length} records...`}
        />

        <Stack direction="row" spacing={1} alignItems="center">
          <SelectColumnSorting {...{ getState: table.getState, getAllColumns: table.getAllColumns, setSorting }} />
          <Button variant="contained" startIcon={<Add />} onClick={handleAddEvent} size="large">
            Add Event
          </Button>
        </Stack>
      </Stack>
      <ScrollX>
        <Stack>
          <RowSelection selected={Object.keys(rowSelection).length} />
          <TableContainer>
            <Table>
              <TableHead>
                {table.getHeaderGroups().map((headerGroup: HeaderGroup<any>) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      if (header.column.columnDef.meta !== undefined && header.column.getCanSort()) {
                        Object.assign(header.column.columnDef.meta, {
                          className: header.column.columnDef.meta.className + ' cursor-pointer prevent-select'
                        });
                      }

                      return (
                        <TableCell
                          key={header.id}
                          {...header.column.columnDef.meta}
                          onClick={header.column.getToggleSortingHandler()}
                          {...(header.column.getCanSort() &&
                            header.column.columnDef.meta === undefined && {
                              className: 'cursor-pointer prevent-select'
                            })}
                        >
                          {header.isPlaceholder ? null : (
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Box>{flexRender(header.column.columnDef.header, header.getContext())}</Box>
                              {header.column.getCanSort() && <HeaderSort column={header.column} />}
                            </Stack>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHead>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <Fragment key={row.id}>
                    <TableRow>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} {...cell.column.columnDef.meta}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                    {row.getIsExpanded() && (
                      <TableRow sx={{ '&:hover': { bgcolor: `${backColor} !important` } }}>
                        <TableCell colSpan={row.getVisibleCells().length}>
                          <EventView id={row.original.eventId} />
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <>
            <Divider />
            <Box sx={{ p: 2 }}>
              <TablePagination
                {...{
                  setPageSize: table.setPageSize,
                  setPageIndex: table.setPageIndex,
                  getState: table.getState,
                  getPageCount: table.getPageCount,
                  initialPageSize: 10
                }}
              />
            </Box>
          </>
        </Stack>
      </ScrollX>
    </MainCard>
  );
}

// ==============================|| Event List ||============================== //

export async function loader() {
  try {
    const response = await axios.get('/api/Event/adminevents', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error loading events:', error);
    return [];
  }
}

const EventList = () => {
  const events = useLoaderData() as Event[];
  const navigate = useNavigate();
  const columns = useMemo<ColumnDef<Event>[]>(
    () => [
      {
        header: '#',
        accessorKey: 'eventId',
        meta: {
          className: 'cell-center'
        }
      },
      {
        header: 'Event Details',
        accessorKey: 'eventName',
        cell: ({ row }) => (
          <Stack direction="row" spacing={1.5} sx={{ minWidth: 200 }}>
            <Avatar
              variant="rounded"
              alt={row.original.eventName}
              color="secondary"
              size="sm"
              src={row.original.eventImageUrl || '/default-event-image.png'}
              sx={{ width: 40, height: 40 }}
            />
            <Stack spacing={0.5}>
              <Typography variant="subtitle1">{row.original.eventName}</Typography>
              <Typography variant="caption" color="text.secondary">
                {row.original.eventDescription}
              </Typography>
            </Stack>
          </Stack>
        )
      },
      {
        header: 'Location',
        cell: ({ row }) => (
          <Stack spacing={0.5} sx={{ minWidth: 120 }}>
            <Typography variant="subtitle2">{row.original.location}</Typography>
          </Stack>
        )
      },
      {
        header: 'Start',
        cell: ({ row }) => (
          <Stack spacing={0.5} sx={{ minWidth: 100 }}>
            <Typography variant="caption">{row.original.startDateTime}</Typography>
            <Typography variant="caption" color="text.secondary">
              {row.original.startDateTime}
            </Typography>
          </Stack>
        )
      },
      {
        header: 'End',
        cell: ({ row }) => (
          <Stack spacing={0.5} sx={{ minWidth: 100 }}>
            <Typography variant="caption">{row.original.endDateTime}</Typography>
            <Typography variant="caption" color="text.secondary">
              {row.original.endDateTime}
            </Typography>
          </Stack>
        )
      },
      {
        header: 'Packages',
        cell: ({ row }) => (
          <Box sx={{ minWidth: 200 }}>
            <Grid container spacing={1}>
              {row.original.packages.map((pkg, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Chip label={`${pkg.packageName}: R${pkg.packagePrice}`} variant="outlined" size="small" sx={{ width: '100%' }} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: ({ row }) => {
          const statusColors = {
            upcoming: 'default',
            ongoing: 'warning',
            completed: 'success',
            cancelled: 'error'
          } as const;

          return (
            <Stack alignItems="center" sx={{ minWidth: 100 }}>
              <Chip
                label={capitalize(row.original.status)}
                color={statusColors[row.original.status as keyof typeof statusColors]}
                variant="outlined"
                size="small"
              />
            </Stack>
          );
        }
      },
      {
        header: 'Actions',
        cell: ({ row }) => (
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ minWidth: 100 }}>
            <Tooltip title="View">
              <IconButton color="secondary" onClick={row.getToggleExpandedHandler()}>
                <Eye />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton
                color="primary"
                onClick={() =>
                  navigate(`/apps/event/edit-event/${row.original.eventId}`, {
                    state: { eventData: row.original }
                  })
                }
              >
                <Edit />
              </IconButton>
            </Tooltip>
          </Stack>
        )
      }
    ],
    [navigate]
  );
  let breadcrumbLinks = [{ title: 'Home', to: APP_DEFAULT_PATH }, { title: 'Event List' }];

  return (
    <>
      <ReactTable data={events} columns={columns} />
    </>
  );
};

export default EventList;
