import { useLoaderData } from 'react-router-dom';

import { capitalize } from '#/utils/string.util';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BaseDataPagination } from '#/base/components/base-data-pagination.component';
import { BaseDataToolbar } from '#/base/components/base-data-toolbar.component';
import { BaseRightSidebar } from '#/base/components/base-right-sidebar.component';
import { UserApprovalStatus } from '../models/user.model';
import { defaultSort, useStudentList } from '../hooks/use-student-list.hook';
import { StudentUserList } from '../components/student-user-list.component';

const filterOptions = [
  {
    key: 'status-approved',
    name: 'status',
    value: UserApprovalStatus.Approved,
    label: 'Enrolled',
  },
  {
    key: 'status-pending',
    name: 'status',
    value: UserApprovalStatus.Pending,
    label: capitalize(UserApprovalStatus.Pending),
  },
  {
    key: 'status-rejected',
    name: 'status',
    value: UserApprovalStatus.Rejected,
    label: capitalize(UserApprovalStatus.Rejected),
  },
];

const defaultFilterOptions = [filterOptions[0]];

const sortOptions = [
  {
    value: 'name',
    label: 'Student Name',
  },
  {
    value: 'publicId',
    label: 'Student Id',
  },
];

export function StudentUserListPage() {
  const {
    students,
    loading,
    totalCount,
    pagination,
    setKeyword,
    setFilters,
    setSort,
    refresh,
    nextPage,
    prevPage,
    handleStudentDetails,
    handleStudentEdit,
  } = useStudentList();

  const data: any = useLoaderData();

  return (
    <BaseDataSuspense resolve={data?.main}>
      <div id='scene-content' className='flex w-full flex-1 items-start pt-5'>
        <div className='flex w-full flex-1 flex-col self-stretch'>
          <BaseDataToolbar
            className='mb-5'
            filterOptions={filterOptions}
            defaulSelectedtFilterOptions={defaultFilterOptions}
            defaultSelectedSort={defaultSort}
            sortOptions={sortOptions}
            onSearchChange={setKeyword}
            onRefresh={refresh}
            onFilter={setFilters}
            onSort={setSort}
          />
          <StudentUserList
            students={students}
            loading={loading}
            onStudentDetails={handleStudentDetails}
            onStudentEdit={handleStudentEdit}
          />
          {!!totalCount && (
            <BaseDataPagination
              totalCount={totalCount}
              pagination={pagination}
              onNext={nextPage}
              onPrev={prevPage}
            />
          )}
        </div>
        {/* TODO sidebar components */}
        <BaseRightSidebar />
      </div>
    </BaseDataSuspense>
  );
}
