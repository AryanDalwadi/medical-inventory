import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Paper,
  TablePagination,
  Typography,
} from '@mui/material';
import type { ReactNode } from 'react';
import AppButton from './AppButton';
import AppTextField from './AppTextField';
import { appColors } from '../../theme/theme';

export interface DataListColumn<T> {
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
  isTitle?: boolean;
  isSubtitle?: boolean;
}

interface DataListProps<T> {
  title: string;
  columns: DataListColumn<T>[];
  rows: T[];
  total: number;
  page: number;
  pageSize: number;
  loading?: boolean;
  searchValue?: string;
  searchPlaceholder?: string;
  addButtonLabel?: string;
  emptyMessage?: string;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSearchChange?: (value: string) => void;
  onSearchSubmit?: () => void;
  onAddClick?: () => void;
  renderCard?: (row: T) => ReactNode;
}

function getCellValue<T extends object>(row: T, column: DataListColumn<T>) {
  if (column.render) {
    return column.render(row);
  }

  return String((row as Record<string, unknown>)[column.key] ?? '-');
}

function DefaultCard<T extends object>({
  row,
  columns,
}: {
  row: T;
  columns: DataListColumn<T>[];
}) {
  const titleColumn = columns.find((column) => column.isTitle) ?? columns[0];
  const subtitleColumn = columns.find((column) => column.isSubtitle);
  const detailColumns = columns.filter(
    (column) => column.key !== titleColumn?.key && column.key !== subtitleColumn?.key
  );

  return (
    <Card
      elevation={2}
      sx={{
        height: '100%',
        borderRadius: 3,
        border: `1px solid ${appColors.border}`,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        {titleColumn && (
          <Typography variant="h6" sx={{ fontWeight: 700, color: appColors.primary, mb: 0.5 }}>
            {getCellValue(row, titleColumn)}
          </Typography>
        )}

        {subtitleColumn && (
          <Typography
            variant="body2"
            sx={{
              display: 'inline-block',
              mb: 2,
              px: 1.2,
              py: 0.3,
              borderRadius: 1,
              bgcolor: appColors.secondaryLight,
              color: appColors.secondary,
              fontWeight: 600,
            }}
          >
            {getCellValue(row, subtitleColumn)}
          </Typography>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
          {detailColumns.map((column) => (
            <Box key={column.key}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                {column.label}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {getCellValue(row, column)}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}

export default function DataList<T extends object>({
  title,
  columns,
  rows,
  total,
  page,
  pageSize,
  loading = false,
  searchValue = '',
  searchPlaceholder = 'Search...',
  addButtonLabel = 'Add New',
  emptyMessage = 'No records found',
  onPageChange,
  onPageSizeChange,
  onSearchChange,
  onSearchSubmit,
  onAddClick,
  renderCard,
}: DataListProps<T>) {
  return (
    <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
      <Box
        sx={{
          px: 3,
          py: 2,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          alignItems: 'center',
          justifyContent: 'space-between',
          background: `linear-gradient(90deg, ${appColors.secondaryLight} 0%, ${appColors.primaryLight} 100%)`,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, color: appColors.primary }}>
          {title}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
          {onSearchChange && (
            <AppTextField
              value={searchValue}
              placeholder={searchPlaceholder}
              onChange={(event) => onSearchChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && onSearchSubmit) {
                  onSearchSubmit();
                }
              }}
              sx={{ minWidth: 220 }}
            />
          )}
          {onSearchSubmit && (
            <AppButton variant="outlined" onClick={onSearchSubmit}>
              Search
            </AppButton>
          )}
          {onAddClick && <AppButton onClick={onAddClick}>{addButtonLabel}</AppButton>}
        </Box>
      </Box>

      <Box sx={{ p: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={36} />
          </Box>
        ) : rows.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography color="text.secondary">{emptyMessage}</Typography>
          </Box>
        ) : (
          <Grid container spacing={2.5}>
            {rows.map((row, index) => (
              <Grid key={index} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                {renderCard ? (
                  renderCard(row)
                ) : (
                  <DefaultCard row={row} columns={columns} />
                )}
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <TablePagination
        component="div"
        count={total}
        page={page - 1}
        rowsPerPage={pageSize}
        onPageChange={(_, newPage) => onPageChange(newPage + 1)}
        onRowsPerPageChange={(event) => {
          onPageSizeChange(Number(event.target.value));
          onPageChange(1);
        }}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </Paper>
  );
}
