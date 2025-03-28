
// Export everything from the slice
import tagsReducer from './tagsSlice';
import * as tagsActions from './actions';
import * as tagsSelectors from './selectors';

export { tagsReducer, tagsActions, tagsSelectors };

// Export specific selectors for convenience
export { 
  selectAllTags,
  selectTagById,
  selectTagsByEntity,
  selectTagsLoading,
  selectTagsError,
  selectTagsTotal,
  selectTagsCurrentPage,
  selectTagsItemsPerPage,
  selectTagsSortField,
  selectTagsSortDirection,
  selectTagsFilterEntity,
  selectTagsSearchQuery,
  selectSelectedTags
} from './selectors';

// Export specific actions for convenience (avoiding duplicates)
export {
  fetchTags,
  createTag,
  updateTag,
  deleteTags,
  setPage,
  setSort,
  setFilter,
  setSearch,
  selectTag,
  // selectAllTags, // Commented out to avoid duplicate
  clearSelectedTags
} from './actions';

export default tagsReducer;
