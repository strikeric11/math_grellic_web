import { useCallback, useRef, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import toast from 'react-hot-toast';

import { capitalize } from '#/utils/string.util';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BaseDataPagination } from '#/base/components/base-data-pagination.component';
import { BaseDataToolbar } from '#/base/components/base-data-toolbar.component';
import { BaseRightSidebar } from '#/base/components/base-right-sidebar.component';
import { BaseModal } from '#/base/components/base-modal.component';
import { UserApprovalStatus } from '../models/user.model';
import {
  defaultSort,
  useStudentUserList,
} from '../hooks/use-student-user-list.hook';
import { useStudentUserPendingEnrollmentList } from '../hooks/use-student-user-pending-enrollment-list.hook';
import { useStudentUserOverview } from '../hooks/use-student-user-overview.hook';
import { StudentUserList } from '../components/student-user-list.component';
import { StudentUserSummary } from '../components/student-user-summary.component';
import { StudentUserOverview } from '../components/student-user-overview.component';
import { StudentUserPendingEnrollmentList } from '../components/student-user-pending-enrollment-list.component';

import type { StudentUserAccount } from '../models/user.model';

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
    isMutateLoading,
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
    setStudentApprovalStatus,
    deleteStudent,
  } = useStudentUserList();

  const {
    pendingStudents,
    loading: pendingLoading,
    refresh: pendingRefresh,
  } = useStudentUserPendingEnrollmentList();

  const {
    enrolledStudentCount,
    loading: overviewLoading,
    refresh: overviewRefresh,
  } = useStudentUserOverview();

  const data: any = useLoaderData();

  const pendingListRef = useRef<any>(null);
  const [openModal, setOpenModal] = useState(false);
  const [currentStudent, setCurrentStudent] =
    useState<StudentUserAccount | null>(null);

  const handleOpenDetails = useCallback(
    (isOpen: boolean) => (student?: StudentUserAccount) => {
      if (student?.approvalStatus === UserApprovalStatus.Approved) {
        handleStudentDetails(student.id);
        return;
      }

      setCurrentStudent(student || null);
      setOpenModal(isOpen);
    },
    [handleStudentDetails],
  );

  const handleStudentStatus = useCallback(
    (approvalStatus: UserApprovalStatus) => () => {
      if (!currentStudent) {
        return;
      }

      try {
        setStudentApprovalStatus(currentStudent.id, approvalStatus);
        handleOpenDetails(false)();
        pendingListRef?.current?.handleRefresh();
      } catch (error: any) {
        toast.error(error.message);
      }
    },
    [currentStudent, setStudentApprovalStatus, handleOpenDetails],
  );

  const handleDelete = useCallback(() => {
    if (!currentStudent) {
      return;
    }

    try {
      deleteStudent(currentStudent.id);
      handleOpenDetails(false)();
      pendingListRef?.current?.handleRefresh();
    } catch (error: any) {
      toast.error(error.message);
    }
  }, [currentStudent, deleteStudent, handleOpenDetails]);

  return (
    <>
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
              onStudentDetails={handleOpenDetails(true)}
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
          <BaseRightSidebar>
            <div className='flex flex-col gap-2.5'>
              <StudentUserPendingEnrollmentList
                ref={pendingListRef}
                pendingStudents={pendingStudents}
                loading={pendingLoading}
                onRefresh={pendingRefresh}
                onStudentDetails={handleOpenDetails(true)}
              />
              <StudentUserOverview
                enrolledStudentCount={enrolledStudentCount}
                loading={overviewLoading}
                onRefresh={overviewRefresh}
              />
            </div>
          </BaseRightSidebar>
        </div>
      </BaseDataSuspense>
      <BaseModal open={openModal} size='sm' onClose={handleOpenDetails(false)}>
        {currentStudent && (
          <StudentUserSummary
            student={currentStudent}
            loading={isMutateLoading}
            onApprove={handleStudentStatus(UserApprovalStatus.Approved)}
            onReject={handleStudentStatus(UserApprovalStatus.Rejected)}
            onDelete={handleDelete}
          />
        )}
      </BaseModal>
    </>
  );
}
