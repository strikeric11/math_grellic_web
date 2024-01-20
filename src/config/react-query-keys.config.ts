export const queryCoreKey = {
  time: ['core', 'time'],
};

export const queryUserKey = {
  currentUser: ['users', 'current-user'],
  studentList: ['users', 'student-list'],
  studentSingle: ['users', 'student-single'],
  studentAssignedTeacher: ['users', 'student-assigned-teacher'],
  allStudentList: ['users', 'all-student-list'],
  selectedStudentList: ['users', 'selected-student-list'],
};

export const queryTeacherPerformanceKey = {
  class: ['performances', 'class'],
  lesson: ['performances', 'lesson'],
  exam: ['performances', 'exam'],
  activity: ['performances', 'activity'],
};

export const queryStudentPerformanceKey = {
  list: ['performances', 'list'],
  single: ['performances', 'single'],
};

export const queryLessonKey = {
  list: ['lessons', 'list'],
  single: ['lessons', 'single'],
  selectedLessonList: ['lessons', 'selected-lesson-list'],
  studentPerformance: ['lessons', 'student-performance'],
};

export const queryExamKey = {
  list: ['exams', 'list'],
  single: ['exams', 'single'],
  studentPerformance: ['exams', 'student-performance'],
};

export const queryActivityKey = {
  list: ['activities', 'list'],
  single: ['activities', 'single'],
  studentPerformance: ['activities', 'student-performance'],
  gameList: ['activities', 'game-list'],
};

export const queryScheduleKey = {
  timeline: ['schedules', 'timeline'],
  daily: ['schedules', 'daily'],
  list: ['schedules', 'list'],
  single: ['schedules', 'single'],
};

export const queryAnnouncementKey = {
  list: ['announcement', 'list'],
  single: ['announcement', 'single'],
};
