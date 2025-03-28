
import tagsReducer from './tagsSlice';
import * as tagsActions from './actions';
import * as tagsSelectors from './selectors';

export { tagsReducer, tagsActions, tagsSelectors };

// Export specific selectors
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

// Export actions
export {
  fetchTags,
  createTag,
  updateTag,
  deleteTags
} from './actions';

// Export reducer actions
export {
  setPage,
  setSort,
  setFilter,
  setSearch,
  selectTag,
  selectAllTags as selectAllTagsAction,
  clearSelectedTags
} from './tagsSlice';

export default tagsReducer;
