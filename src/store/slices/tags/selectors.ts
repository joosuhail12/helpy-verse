
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/store/store';
import { Tag } from '@/types/tag';

// Base selector
const getTagsState = (state: RootState) => state.tags;

// Memoized selectors
export const selectTags = createSelector(
  [getTagsState],
  (tagsState) => tagsState.ids.map(id => tagsState.entities[id])
);

export const selectAllTags = selectTags;

export const selectTagsTotal = createSelector(
  [getTagsState],
  (tagsState) => tagsState.total
);

export const selectTagsLoading = createSelector(
  [getTagsState],
  (tagsState) => tagsState.loading
);

export const selectTagsError = createSelector(
  [getTagsState],
  (tagsState) => tagsState.error
);

export const selectTagsCurrentPage = createSelector(
  [getTagsState],
  (tagsState) => tagsState.currentPage
);

export const selectTagsItemsPerPage = createSelector(
  [getTagsState],
  (tagsState) => tagsState.itemsPerPage
);

export const selectTagsSortField = createSelector(
  [getTagsState],
  (tagsState) => tagsState.sortField
);

export const selectTagsSortDirection = createSelector(
  [getTagsState],
  (tagsState) => tagsState.sortDirection
);

export const selectTagsFilterEntity = createSelector(
  [getTagsState],
  (tagsState) => tagsState.filterEntity
);

export const selectTagsSearchQuery = createSelector(
  [getTagsState],
  (tagsState) => tagsState.searchQuery
);

export const selectSelectedTags = createSelector(
  [getTagsState],
  (tagsState) => tagsState.selectedTags
);

// Parameterized selectors
export const selectTagById = createSelector(
  [selectTags, (_, tagId: string) => tagId],
  (tags, tagId) => tags.find(tag => tag.id === tagId) || null
);

export const selectTagsByEntity = createSelector(
  [selectTags, (_, entity: string) => entity],
  (tags, entity) => tags.filter(tag => tag.counts && tag.counts[entity as keyof typeof tag.counts] > 0)
);
