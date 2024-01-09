import {
  Outlet,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';

import { queryClient } from '#/config/react-query-client.config';

import { RecordStatus } from '#/core/models/core.model';
import { coreRouteHandle } from '#/core/core-route-handle';
import { CorePageNotFound } from '#/core/components/core-page-not-found.component';
import { CoreStaticLayout } from '#/core/components/core-static-layout.component';
import { CoreLayout } from '#/core/components/core-layout.component';

import { UserRole } from '#/user/models/user.model';
import { AuthProtectedRoute } from '#/user/components/auth-protected-route.component';

import { HomePage } from '#/static/pages/home.page';
import { AboutPage } from '#/static/pages/about.page';
import { AuthRegisterPage } from '#/user/pages/auth-register.page';

import { dashboardRouteHandle } from '#/dashboard/route/dashboard-handle.route';
import { TeacherDashboardPage } from '#/dashboard/pages/teacher-dashboard.page';
import { StudentDashboardPage } from '#/dashboard/pages/student-dashboard.page';

import { teacherLessonRouteHandle } from '#/lesson/route/teacher-lesson-handle.route';
import { teacherExamRouteHandle } from '#/exam/route/teacher-exam-handle.route';
import { teacherActivityRouteHandle } from '#/activity/route/teacher-activity-handle.route';
import { studentLessonRouteHandle } from '#/lesson/route/student-lesson-handle.route';
import { studentExamRouteHandle } from '#/exam/route/student-exam-handle.route';
import { studentActivityRouteHandle } from '#/activity/route/student-activity-handle.route';
import { teacherStudentPerformanceRouteHandle } from '#/performance/route/teacher-performance-handle.route';
import { studentPerformanceRouteHandle } from '#/performance/route/student-performance-handle.route';
import { teacherScheduleRouteHandle } from '#/schedule/route/teacher-schedule-handle.route';
import { studentScheduleRouteHandle } from '#/schedule/route/student-schedule-handle.route';
import { studentUserRouteHandle } from '#/user/route/student-user-handle';
import { currentUserRouteHandle } from '#/user/route/current-user-handle';
import { studentHelpRouteHandle } from '#/help/route/student-help-handle.route';
import { LessonCreatePage } from '#/lesson/pages/lesson-create.page';
import { getStudentAssignedTeacherLoader } from '#/user/route/student-assigned-teacher-loader.route';
import {
  getPaginatedLessonsLoader as getTeacherPaginatedLessonsLoader,
  getLessonBySlugLoader as getTeacherLessonBySlugLoader,
} from '#/lesson/route/teacher-lesson-loader.route';
import {
  getPaginatedExamsLoader as getTeacherPaginatedExamsLoader,
  getExamBySlugLoader as getTeacherExamBySlugLoader,
} from '#/exam/route/teacher-exam-loader.route';
import {
  getPaginatedActivitiesLoader as getTeacherPaginatedActivitiesLoader,
  getActivityBySlugLoader as getTeacherActivityBySlugLoader,
} from '#/activity/route/teacher-activity-loader.route';
import {
  getPaginatedStudentPerformancesLoader,
  getStudentPerformanceByPublicIdLoader,
} from '#/performance/route/teacher-performance-loader.route';
import {
  getSchedulesByDateRangeLoader as getTeacherSchedulesByDateRangeLoader,
  getMeetingScheduleByIdLoader as getTeacherMeetingScheduleByIdLoader,
  getPaginatedMeetingSchedulesLoader as getTeacherPaginatedMeetingScheduleLoader,
} from '#/schedule/route/teacher-schedule-loader.route';
import {
  getLessonsLoader as getStudentLessonsLoader,
  getLessonBySlugLoader as getStudentLessonBySlugLoader,
} from '#/lesson/route/student-lesson-loader.route';
import {
  getExamsLoader as getStudentExamsLoader,
  getExamBySlugLoader as getStudentExamBySlugLoader,
} from '#/exam/route/student-exam-loader.route';
import {
  getActivitiesLoader as getStudentActivitiesLoader,
  getActivityBySlugLoader as getStudentActivityBySlugLoader,
} from '#/activity/route/student-activity-loader.route';
import {
  getSchedulesByDateRangeLoader as getStudentSchedulesByDateRangeLoader,
  getMeetingSchedulesLoader as getStudentMeetingSchedulesLoader,
  getMeetingScheduleByIdLoader as getStudentMeetingScheduleByIdLoader,
} from '#/schedule/route/student-schedule-loader.route';
import {
  getPaginatedStudentUserLoader,
  getStudentUserByIdLoader,
} from '#/user/route/student-user-loader';
import { TeacherCurrentUserSinglePage } from '#/user/pages/teacher-current-user-single.page';
import { TeacherUserAccountEditPage } from '#/user/pages/teacher-current-user-edit.page';
import { StudentUserAccountEditPage } from '#/user/pages/student-current-user-edit.page';
import { StudentAssignedTeacherPage } from '#/user/pages/student-assigned-teacher.page';
import { StudentCurrentUserSinglePage } from '#/user/pages/student-current-user-single.page';
import { TeacherLessonListPage } from '#/lesson/pages/teacher-lesson-list.page';
import { TeacherLessonSinglePage } from '#/lesson/pages/teacher-lesson-single.page';
import { TeacherLessonScheduleListPage } from '#/lesson/pages/teacher-lesson-schedule-list.page';
import { TeacherLessonScheduleCreatePage } from '#/lesson/pages/teacher-lesson-schedule-create.page';
import { TeacherLessonScheduleEditPage } from '#/lesson/pages/teacher-lesson-schedule-edit.page';
import { TeacherExamListPage } from '#/exam/pages/teacher-exam-list.page';
import { StudentLessonListPage } from '#/lesson/pages/student-lesson-list.page';
import { StudentLessonSinglePage } from '#/lesson/pages/student-lesson-single.page';
import { LessonPreviewSlugPage } from '#/lesson/pages/lesson-preview-slug.page';
import { LessonPreviewPage } from '#/lesson/pages/lesson-preview.page';
import { LessonEditPage } from '#/lesson/pages/lesson-edit.page';
import { TeacherExamSinglePage } from '#/exam/pages/teacher-exam-single.page';
import { ExamCreatePage } from '#/exam/pages/exam-create.page';
import { ExamEditPage } from '#/exam/pages/exam-edit.page';
import { ExamPreviewPage } from '#/exam/pages/exam-preview.page';
import { ExamPreviewSlugPage } from '#/exam/pages/exam-preview-slug.page';
import { TeacherExamScheduleListPage } from '#/exam/pages/teacher-exam-schedule-list.page';
import { TeacherExamScheduleCreatePage } from '#/exam/pages/teacher-exam-schedule-create.page';
import { TeacherExamScheduleEditPage } from '#/exam/pages/teacher-exam-schedule-edit.page';
import { StudentExamListPage } from '#/exam/pages/student-exam-list.page';
import { StudentExamSinglePage } from '#/exam/pages/student-exam-single.page';
import { TeacherActivityListPage } from '#/activity/pages/teacher-activity-list.page';
import { ActivityCreatePage } from '#/activity/pages/activity-create.page';
import { ActivityEditPage } from '#/activity/pages/activity-edit.page';
import { ActivityPreviewSlugPage } from '#/activity/pages/activity-preview-slug.page';
import { TeacherActivitySinglePage } from '#/activity/pages/teacher-activity-single.page';
import { StudentActivityListPage } from '#/activity/pages/student-activity-list.page';
import { StudentActivitySinglePage } from '#/activity/pages/student-activity-single.page';
import { StudentPerformanceListPage } from '#/performance/pages/student-performance-list.page';
import { TeacherStudentPerformanceSinglePage } from '#/performance/pages/teacher-student-performance-single.page';
import { StudentPerformanceSinglePage } from '#/performance/pages/student-performance-single.page';
import { TeacherScheduleCalendarPage } from '#/schedule/pages/teacher-schedule-calendar.page';
import { StudentScheduleCalendarPage } from '#/schedule/pages/student-schedule-calendar.page';
import { MeetingScheduleCreatePage } from '#/schedule/pages/meeting-schedule-create.page';
import { MeetingScheduleEditPage } from '#/schedule/pages/meeting-schedule-edit.page';
import { TeacherMeetingScheduleListPage } from '#/schedule/pages/teacher-meeting-schedule-list.page';
import { TeacherMeetingScheduleSinglePage } from '#/schedule/pages/teacher-meeting-schedule-single.page';
import { StudentMeetingScheduleSinglePage } from '#/schedule/pages/student-meeting-schedule-single.page';
import { StudentMeetingScheduleListPage } from '#/schedule/pages/student-meeting-schedule-list.page';
import { StudentUserListPage } from '#/user/pages/student-user-list.page';
import { StudentUserSinglePage } from '#/user/pages/student-user-single.page';
import { StudentUserCreatePage } from '#/user/pages/student-user-create.page';
import { StudentUserEditPage } from '#/user/pages/student-user-edit.page';
import { StudentHelpPage } from '#/help/pages/student-help.page';

import { staticRoutes } from './static-routes';
import { teacherBaseRoute, teacherRoutes } from './teacher-routes';
import { studentBaseRoute, studentRoutes } from './student-routes';

const rootRoutes = createRoutesFromElements(
  <>
    <Route path='/' element={<CoreStaticLayout />}>
      <Route index element={<HomePage />} />
      <Route path={staticRoutes.about.to} element={<AboutPage />} />
      <Route
        path={staticRoutes.training.to}
        element={
          // TODO training page
          <div className='hidden'>TRAINING PAGE</div>
        }
      />
      <Route
        path={staticRoutes.authRegister.to}
        element={<AuthRegisterPage />}
      />
      <Route
        path='*'
        element={
          <CorePageNotFound className='!h-screen' linkLabel='Return to home' />
        }
      />
    </Route>
    {/* TEACHER */}
    <Route
      path={teacherBaseRoute}
      element={
        <AuthProtectedRoute roles={[UserRole.Teacher]}>
          <CoreLayout />
        </AuthProtectedRoute>
      }
    >
      <Route
        index
        element={<TeacherDashboardPage />}
        handle={dashboardRouteHandle}
      />
      {/* TEACHER CURRENT USER */}
      <Route path={teacherRoutes.account.to} element={<Outlet />}>
        <Route
          index
          element={<TeacherCurrentUserSinglePage />}
          handle={currentUserRouteHandle.single}
        />
        <Route
          path={teacherRoutes.account.editTo}
          element={<TeacherUserAccountEditPage />}
          handle={currentUserRouteHandle.edit}
        />
      </Route>
      {/* TEACHER LESSONS */}
      <Route path={teacherRoutes.lesson.to} element={<Outlet />}>
        <Route
          index
          element={<TeacherLessonListPage />}
          handle={teacherLessonRouteHandle.list}
          loader={getTeacherPaginatedLessonsLoader(queryClient)}
        />
        <Route path=':slug' element={<Outlet />}>
          <Route
            index
            element={<TeacherLessonSinglePage />}
            handle={teacherLessonRouteHandle.single}
            loader={getTeacherLessonBySlugLoader(queryClient)}
          />
          <Route
            path={teacherRoutes.lesson.editTo}
            element={<LessonEditPage />}
            handle={teacherLessonRouteHandle.edit}
            loader={getTeacherLessonBySlugLoader(queryClient)}
          />
          <Route
            path={teacherRoutes.lesson.previewTo}
            element={<LessonPreviewSlugPage />}
            handle={teacherLessonRouteHandle.preview}
            loader={getTeacherLessonBySlugLoader(queryClient, {
              exclude: 'schedules',
            })}
          />
          <Route
            path={`${teacherRoutes.lesson.schedule.to}`}
            element={<TeacherLessonScheduleListPage />}
            handle={teacherLessonRouteHandle.schedule}
            loader={getTeacherLessonBySlugLoader(queryClient, {
              status: RecordStatus.Published,
            })}
          >
            <Route
              path={`${teacherRoutes.lesson.schedule.createTo}`}
              element={<TeacherLessonScheduleCreatePage />}
              handle={teacherLessonRouteHandle.schedule}
            />
            <Route
              path={`${teacherRoutes.lesson.schedule.editTo}`}
              element={<TeacherLessonScheduleEditPage />}
              handle={teacherLessonRouteHandle.schedule}
            />
          </Route>
        </Route>
        <Route
          path={teacherRoutes.lesson.createTo}
          element={<LessonCreatePage />}
          handle={teacherLessonRouteHandle.create}
        />
        <Route
          path={teacherRoutes.lesson.previewTo}
          element={<LessonPreviewPage />}
          handle={teacherLessonRouteHandle.preview}
        />
      </Route>
      {/* TEACHER EXAMS */}
      <Route path={teacherRoutes.exam.to} element={<Outlet />}>
        <Route
          index
          element={<TeacherExamListPage />}
          handle={teacherExamRouteHandle.list}
          loader={getTeacherPaginatedExamsLoader(queryClient)}
        />
        <Route path=':slug' element={<Outlet />}>
          <Route
            index
            element={<TeacherExamSinglePage />}
            handle={teacherExamRouteHandle.single}
            loader={getTeacherExamBySlugLoader(queryClient)}
          />
          <Route
            path={teacherRoutes.exam.editTo}
            element={<ExamEditPage />}
            handle={teacherExamRouteHandle.edit}
            loader={getTeacherExamBySlugLoader(queryClient)}
          />
          <Route
            path={teacherRoutes.exam.previewTo}
            element={<ExamPreviewSlugPage />}
            handle={teacherExamRouteHandle.preview}
            loader={getTeacherExamBySlugLoader(queryClient, {
              exclude: 'schedules',
            })}
          />
          <Route
            path={`${teacherRoutes.exam.schedule.to}`}
            element={<TeacherExamScheduleListPage />}
            handle={teacherExamRouteHandle.schedule}
            loader={getTeacherExamBySlugLoader(queryClient, {
              status: RecordStatus.Published,
            })}
          >
            <Route
              path={`${teacherRoutes.exam.schedule.createTo}`}
              element={<TeacherExamScheduleCreatePage />}
              handle={teacherLessonRouteHandle.schedule}
            />
            <Route
              path={`${teacherRoutes.exam.schedule.editTo}`}
              element={<TeacherExamScheduleEditPage />}
              handle={teacherExamRouteHandle.schedule}
            />
          </Route>
        </Route>
        <Route
          path={teacherRoutes.exam.createTo}
          element={<ExamCreatePage />}
          handle={teacherExamRouteHandle.create}
        />
        <Route
          path={teacherRoutes.exam.previewTo}
          element={<ExamPreviewPage />}
          handle={teacherExamRouteHandle.preview}
        />
      </Route>
      {/* TEACHER ACTIVITIES */}
      <Route path={teacherRoutes.activity.to} element={<Outlet />}>
        <Route
          index
          element={<TeacherActivityListPage />}
          handle={teacherActivityRouteHandle.list}
          loader={getTeacherPaginatedActivitiesLoader(queryClient)}
        />
        <Route path=':slug' element={<Outlet />}>
          <Route
            index
            element={<TeacherActivitySinglePage />}
            handle={teacherActivityRouteHandle.single}
            loader={getTeacherActivityBySlugLoader(queryClient)}
          />
          <Route
            path={teacherRoutes.activity.editTo}
            element={<ActivityEditPage />}
            handle={teacherActivityRouteHandle.edit}
            loader={getTeacherActivityBySlugLoader(queryClient)}
          />
          <Route
            path={teacherRoutes.activity.previewTo}
            element={<ActivityPreviewSlugPage />}
            handle={teacherActivityRouteHandle.preview}
            loader={getTeacherActivityBySlugLoader(queryClient)}
          />
        </Route>
        <Route
          path={teacherRoutes.activity.createTo}
          element={<ActivityCreatePage />}
          handle={teacherActivityRouteHandle.create}
        />
        {/* <Route
          path={teacherRoutes.activity.previewTo}
          element={<ActivityPreviewPage />}
          handle={teacherActivityRouteHandle.preview}
        /> */}
      </Route>
      <Route
        path='*'
        element={<CorePageNotFound to={`/${teacherBaseRoute}`} />}
        handle={coreRouteHandle.notFound}
      />
      {/* TEACHER PERFORMANCE */}
      <Route path={teacherRoutes.performance.to} element={<Outlet />}>
        <Route
          index
          element={<StudentPerformanceListPage />}
          handle={teacherStudentPerformanceRouteHandle.list}
          loader={getPaginatedStudentPerformancesLoader(queryClient)}
        />
        <Route path=':publicId' element={<Outlet />}>
          <Route
            index
            element={<TeacherStudentPerformanceSinglePage />}
            handle={teacherStudentPerformanceRouteHandle.single}
            loader={getStudentPerformanceByPublicIdLoader(queryClient)}
          />
        </Route>
      </Route>
      {/* TEACHER SCHEDULE */}
      <Route path={teacherRoutes.schedule.to} element={<Outlet />}>
        <Route
          index
          element={<TeacherScheduleCalendarPage />}
          handle={teacherScheduleRouteHandle.calendar}
          loader={getTeacherSchedulesByDateRangeLoader(queryClient)}
        />
        <Route path={teacherRoutes.schedule.meeting.to} element={<Outlet />}>
          <Route
            index
            element={<TeacherMeetingScheduleListPage />}
            handle={teacherScheduleRouteHandle.list}
            loader={getTeacherPaginatedMeetingScheduleLoader(queryClient)}
          />
          <Route
            path={teacherRoutes.schedule.meeting.createTo}
            element={<MeetingScheduleCreatePage />}
            handle={teacherScheduleRouteHandle.create}
          />
          <Route path=':id' element={<Outlet />}>
            <Route
              index
              element={<TeacherMeetingScheduleSinglePage />}
              handle={teacherScheduleRouteHandle.single}
              loader={getTeacherMeetingScheduleByIdLoader(queryClient)}
            />
            <Route
              path={teacherRoutes.schedule.meeting.editTo}
              element={<MeetingScheduleEditPage />}
              handle={teacherScheduleRouteHandle.edit}
              loader={getTeacherMeetingScheduleByIdLoader(queryClient)}
            />
          </Route>
        </Route>
      </Route>
      {/* TEACHER STUDENT */}
      <Route path={teacherRoutes.student.to} element={<Outlet />}>
        <Route
          index
          element={<StudentUserListPage />}
          handle={studentUserRouteHandle.list}
          loader={getPaginatedStudentUserLoader(queryClient)}
        />
        <Route path=':id' element={<Outlet />}>
          <Route
            index
            element={<StudentUserSinglePage />}
            handle={studentUserRouteHandle.single}
            loader={getStudentUserByIdLoader(queryClient)}
          />
          <Route
            path={teacherRoutes.student.editTo}
            element={<StudentUserEditPage />}
            handle={studentUserRouteHandle.edit}
            loader={getStudentUserByIdLoader(queryClient)}
          />
        </Route>
        <Route
          path={teacherRoutes.student.createTo}
          element={<StudentUserCreatePage />}
          handle={studentUserRouteHandle.create}
        />
      </Route>
    </Route>
    {/* STUDENT */}
    <Route
      path={studentBaseRoute}
      element={
        <AuthProtectedRoute roles={[UserRole.Student]}>
          <CoreLayout />
        </AuthProtectedRoute>
      }
    >
      <Route
        index
        element={<StudentDashboardPage />}
        handle={dashboardRouteHandle}
      />
      {/* STUDENT CURRENT USER */}
      <Route path={studentRoutes.account.to} element={<Outlet />}>
        <Route
          index
          element={<StudentCurrentUserSinglePage />}
          handle={currentUserRouteHandle.single}
          loader={getStudentAssignedTeacherLoader(queryClient)}
        />
        <Route
          path={studentRoutes.account.editTo}
          handle={currentUserRouteHandle.edit}
          element={<StudentUserAccountEditPage />}
        />
        <Route
          path={studentRoutes.account.teacherAccountTo}
          element={<StudentAssignedTeacherPage />}
          handle={currentUserRouteHandle.assignedTeacher}
          loader={getStudentAssignedTeacherLoader(queryClient)}
        />
      </Route>
      {/* STUDENT LESSONS */}
      <Route path={studentRoutes.lesson.to} element={<Outlet />}>
        <Route
          index
          element={<StudentLessonListPage />}
          handle={studentLessonRouteHandle.list}
          loader={getStudentLessonsLoader(queryClient)}
        />
        <Route
          path=':slug'
          element={<StudentLessonSinglePage />}
          handle={studentLessonRouteHandle.single}
          loader={getStudentLessonBySlugLoader(queryClient)}
        />
      </Route>
      {/* STUDENT EXAMS */}
      <Route path={studentRoutes.exam.to} element={<Outlet />}>
        <Route
          index
          element={<StudentExamListPage />}
          handle={studentExamRouteHandle.list}
          loader={getStudentExamsLoader(queryClient)}
        />
        <Route
          path=':slug'
          element={<StudentExamSinglePage />}
          handle={studentExamRouteHandle.single}
          loader={getStudentExamBySlugLoader(queryClient)}
        />
      </Route>
      {/* STUDENT ACTIVITIES */}
      <Route path={studentRoutes.activity.to} element={<Outlet />}>
        <Route
          index
          element={<StudentActivityListPage />}
          handle={studentActivityRouteHandle.list}
          loader={getStudentActivitiesLoader(queryClient)}
        />
        <Route
          path=':slug'
          element={<StudentActivitySinglePage />}
          handle={studentActivityRouteHandle.single}
          loader={getStudentActivityBySlugLoader(queryClient)}
        />
      </Route>
      {/* STUDENT PERFORMANCE */}
      <Route path={studentRoutes.performance.to} element={<Outlet />}>
        <Route
          index
          element={<StudentPerformanceSinglePage />}
          handle={studentPerformanceRouteHandle.single}
        />
      </Route>
      {/* STUDENT SCHEDULE */}
      <Route path={studentRoutes.schedule.to} element={<Outlet />}>
        <Route
          index
          element={<StudentScheduleCalendarPage />}
          handle={studentScheduleRouteHandle.calendar}
          loader={getStudentSchedulesByDateRangeLoader(queryClient)}
        />
        <Route path={studentRoutes.schedule.meeting.to} element={<Outlet />}>
          <Route
            index
            element={<StudentMeetingScheduleListPage />}
            handle={studentScheduleRouteHandle.list}
            loader={getStudentMeetingSchedulesLoader(queryClient)}
          />
          <Route path=':id' element={<Outlet />}>
            <Route
              index
              element={<StudentMeetingScheduleSinglePage />}
              handle={studentScheduleRouteHandle.single}
              loader={getStudentMeetingScheduleByIdLoader(queryClient)}
            />
          </Route>
        </Route>
      </Route>
      {/* STUDENT HELP */}
      <Route
        path={studentRoutes.help.to}
        element={<StudentHelpPage />}
        handle={studentHelpRouteHandle}
        loader={getStudentAssignedTeacherLoader(queryClient)}
      />
    </Route>
  </>,
);

export const router = createBrowserRouter(rootRoutes);
