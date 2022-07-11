import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import { create } from 'react-test-renderer';
import {RootState} from '../app/store';
import { ReviewsInterface } from '../components/TeacherReviews';
import ApiGateway from '../config/apiGateway';
import {
  CategoryInterface,
  FindCoursesInterfaceFinal,
} from '../screens/FindCourse';
import {
  CourseEnrollInterface,
  GetCourseDataInterface,
  TeacherCalenderInterface,
  TeacherReviewInterface,
} from '../screens/FindCourse/CourseDetails';
import {TeacherCategory} from '../screens/FindCourse/TeacherDetails';

// export const getCourses = createAsyncThunk(
//   'course/getCourses',
//   async () => {
//     const response = await ApiGateway.post(
//       'courses/findcourses?format=json&offset=0',''
//     );
//     return response.data;
//   },
// );

// export const getCourses = createAsyncThunk(
//   'course/getCourses',
//   async (final_data : FindCoursesInterfaceFinal) => {
//     console.log(final_data.offset)
//     const response = await ApiGateway.post(
//       'courses/search?format=json&offset='+final_data.offset, final_data.data
//     );
//     console.log(response);
//     return response.data;
//   },
// );

// export const getCategories = createAsyncThunk(
//   'course/getCategories',
//   async () => {
//     const response = await ApiGateway.get('courses/categories?format=json', false);
//     return response.data;
//   },
// );

export const getCategories = createAsyncThunk(
  'course/getCategories',
  async (data: CategoryInterface) => {
    const response = await ApiGateway.get(
      'courses/categories?nationality=' +
        data.nationality +
        '&format=json',
      false,
    );
    return response.data;
  },
);

export const getTeacherCalender = createAsyncThunk(
  'courses/getTeacherCalender',
  (data: TeacherCalenderInterface) => {
    let teacherToken = data.teacherToken;
    let classType = data.classType;
    let courseID = data.courseID;
    let response;
    if (teacherToken && classType && courseID) {
      const response = ApiGateway.get(
        'attendance/get-upcoming-class-list?class_type=' +
          classType +
          '&' +
          'tr_tk=' +
          teacherToken +
          '&course_id=' +
          courseID +
          '&format=json',
        false,
      );
      console.log('teacherToken && classType && courseID');
      console.log(response);
    } else if (teacherToken && classType) {
      response = ApiGateway.get(
        'attendance/get-upcoming-class-list?class_type=' +
          classType +
          '&' +
          'tr_tk=' +
          teacherToken +
          '&format=json',
        false,
      );
      console.log('teacherToken && classType');
      // console.log(response);
    } else if (teacherToken) {
      response = ApiGateway.get(
        'attendance/get-upcoming-class-list?tr_tk=' +
          teacherToken +
          '&format=json',
        false,
      );
    } else if (classType) {
      response = ApiGateway.get(
        'attendance/get-upcoming-class-list?class_type=' +
          classType +
          '&format=json',
        false,
      );
    } else {
      response = ApiGateway.get(
        'attendance/get-upcoming-class-list?tr_tk=' +
          teacherToken +
          '&format=json',
        false,
      );
      console.log('else');
      // console.log(response);
    }
    return response;
  },
);

export const getTeacherReviews = createAsyncThunk(
  'courses/getTeacherReviews',
  (data: TeacherReviewInterface) => {
    let response;
    let categorySlug = data.category;
    let teacherSlug = data.teacher;

    response = ApiGateway.get(
      'courses/course-testimonial?category_slug=' +
        categorySlug +
        '&teacher_slug=' +
        teacherSlug,
      false,
      //response =  ApiGateway.get("courses/course-testimonial?category_slug=dance-styles&teacher_slug=vikas-s-gopa"
    );
    return response;
  },
);



export const getCategoryDetails = createAsyncThunk(
  'courses/getCategoryDetails',
  async (data: any) => {
    let response;
    response = await ApiGateway.get(
      'courses/categories-detail?category_slug=' + data.category_slug,
      false,
    );
    return response;
  },
);

export const getCategoryCourseList = createAsyncThunk(
  'courses/getCategoryCourseList',
  async (data: any) => {
    let response;
    response = await ApiGateway.get(
      'courses/categories-course-list?category_slug=' +
        data.category_slug +
        '&filter=' +
        data.filter +
        '&sort_by=' +
        data.sort_by +
        '&offset=' +
        data.offset,
      false,
    );
    return response;
  },
);

export const getLookups = createAsyncThunk('courses/getLookups', async () => {
  let response = await ApiGateway.get('lookups/?format=json');
  return response;
});

export const getCategoryTeacher = createAsyncThunk(
  'courses/getCategoryTeacher',
  async (data: TeacherCategory) => {
    const categorySlug = data.category_slug;
    const teacherSlug = data.teacher_slug;
    let response;
    response = await ApiGateway.get(
      'courses/teacher-course-slug?category_slug=' +
        categorySlug +
        '&teacher_slug=' +
        teacherSlug,
      false,
    );
    if (response.data.status === 'success') {
      return response.data.data;
    }
    return [];
  },
);

// const enrolNow = (data) => {
//   return axios
//     .post(API_URL + "/checkoutcourses/checkout-course?format=json", data, {
//       headers: authHeader(),
//     })
//     .then((response) => {
//       return response.data;
//     });
// };

// let enrollData = {
//   course: courseDetail.id,
//   price_per_class:
//     currency_type === ENV_APP_CURRENCYTYPEINR
//       ? selectedPrice.final_INR
//       : selectedPrice.final_USD,
//   currency_type: currency_type,
//   classes_per_week: total_cpw,
//   number_of_weeks: total_weeks,
//   number_of_class: total_class,
//   billing_first_name: session.first_name,
//   billing_last_name: session.last_name,
//   billing_street_address: "",
//   billing_city: session.ip_city,
//   billing_pin_code: "",
//   billing_state: session.ip_state,
//   billing_country: session.ip_country,
//   class_type: selectedPrice.id,
//   purchase_type: purchase_type,
//   discounts: courseDetail.discounts ? courseDetail.discounts : "",
//   timezone: getCookiesData("sessionTimeZone"),
// };

// let finalReviewData = {};

//     finalReviewData.billing_country = country;
//     finalReviewData.checkout_token = courseCheckout.checkout_token;
//     finalReviewData.course = courseCheckout.course.id;
//     finalReviewData.billing_city = data.billing_city;
//     finalReviewData.billing_first_name = data.billing_first_name;
//     finalReviewData.billing_last_name = data.billing_last_name;
//     finalReviewData.billing_pin_code = data.billing_pin_code;
//     finalReviewData.billing_state = region;
//     finalReviewData.billing_street_address = data.billing_street_address;
//     finalReviewData.order_comments = data.order_comments;
//     finalReviewData.payment_gateway = data.payment_gateway;
//     finalReviewData.purchase_type = courseCheckout.purchase_type;
//     finalReviewData.class_type = courseCheckout.class_type.id;
//     finalReviewData.timezone = getCookiesData("sessionTimeZone");
//     finalReviewData.contact_taught_on = selectedTaughtOn
//       ? selectedTaughtOn
//       : "";
//     finalReviewData.contact_email = data.contact_email
//       ? data.contact_email
//       : "";
//     finalReviewData.contact_phone_no = data.contact_phone_no
//       ? data.contact_phone_no
//       : "";

//     finalReviewData.number_of_class = courseCheckout.amount.number_of_class;
//     finalReviewData.classes_per_week = courseCheckout.amount.classes_per_week;
//     finalReviewData.number_of_weeks = courseCheckout.amount.number_of_weeks;
//     finalReviewData.coupon_code = courseCheckout.amount.coupon_code;
//     finalReviewData.coupon_discount_amount =
//       courseCheckout.amount.coupon_discount_amount;
//     finalReviewData.currency_type = courseCheckout.amount.currency_type;
//     finalReviewData.price_per_class = courseCheckout.amount.price_per_class;
//     finalReviewData.device_type = "web";

// const checkoutUpdate = (data, type) => {
//   return axios
//     .patch(API_URL + "/checkoutcourses/checkout-course?format=json", data, {
//       headers: authHeader(),
//     })
//     .then((response) => {
//       return response.data;
//     });
// };

//coupon

// if (type === "AC") {
//   finalcopounCode = copounCode;
// } else if (type === "RC") {
//   finalcopounCode = "";
//   copounData.coupon_discount_amount = "0.00";
// }

// copounData.checkout_token = finalData.checkout_token;
// copounData.course = finalData.course.id;
// copounData.coupon_code = finalcopounCode;
// copounData.number_of_class = finalData.amount.number_of_class;
// copounData.classes_per_week = finalData.amount.classes_per_week;
// copounData.price_per_class = finalData.amount.price_per_class;
// copounData.number_of_weeks = finalData.amount.number_of_weeks;
// copounData.currency_type = finalData.amount.currency_type;
// copounData.total_amount = finalData.amount.total_amount;
// copounData.class_type = finalData.class_type.id;
// copounData.discount_amount = finalData.amount.discount_amount;
// copounData.timezone = getCookiesData("sessionTimeZone");
// copounData.device_type = "web";

// if (type === "AC") {
//   dispatch(applyCoupon(copounData, type))

// const applyCoupon = (data, type) => {
//   if (type === "AC") {
//     return axios
//       .post(API_URL + "/coupon/apply-coupon?format=json", data, {
//         headers: authHeader(),
//       })
//       .then((response) => {
//         return response.data;
//       });
//   }
// };

// const dispatchCheckoutUpdate = (courseCheckout, cpw, noc, now) => {
//   let finalData = { ...courseCheckout };
//   let ClassPerWeekData = {};
//   ClassPerWeekData.checkout_token = finalData.checkout_token;
//   ClassPerWeekData.course = finalData.course.id;
//   ClassPerWeekData.price_per_class = finalData.amount.price_per_class;
//   ClassPerWeekData.currency_type = finalData.amount.currency_type;
//   ClassPerWeekData.class_type = finalData.class_type.id;
//   ClassPerWeekData.timezone = getCookiesData("sessionTimeZone");
//   ClassPerWeekData.classes_per_week = cpw;
//   ClassPerWeekData.number_of_weeks = now;
//   ClassPerWeekData.number_of_class = noc;
//   ClassPerWeekData.total_amount = (
//     finalData.amount.price_per_class * noc
//   ).toFixed(2);
//   ClassPerWeekData.device_type = "web";

//   dispatch(checkoutUpdate(ClassPerWeekData))
//     .then((response) => {
//       setLoader(false);
//     })
//     .catch(() => {
//       setLoader(false);
//     });
//   setReviewSubmited(false);
// };

const initialState: any = {
  courseData: {},
  categoryData: {},
  categoryStatus: null,
  courseStatus: null,
  teacherAttendance: [],
  categoryDetails: {},
  course: {},
  categoryDetailStatus: null,
  teacherReviews: [],
  categoryTeacherLoading: false,
  categoryTeacher: [],
  courseDetailStatus: null,
  teacherReviewsStatus: null,
  searchText: '',
  coursesArray: [],
  showMore: true,
  page: 'home',
  nationality: 'INDIAN',
  selectedCategories: [],
  selectedSubcategories: [],
  selectedLevels: [],
  offset: 0,
  selectedSecsubcategories: [],
  categoryCourseList: [],
  categoryCourseListStatus: null,
};

export const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {
    fetchCourseSuccess: (state, action: PayloadAction<any>) => {
      state.courseData = action.payload;
      state.courseStatus = 'success';
    },
    teacherAvailability: (state, action: PayloadAction<any>) => {
      state.teacherAttendance = action.payload;
    },
    setTeacherReviews: (state, action: PayloadAction<any>) => {
      state.teacherReviews = action.payload;
    },
    setCurrentCourse: (state, action: PayloadAction<any>) => {
      state.course = action.payload;
    },
    setSearchText: (state, action: PayloadAction<any>) => {
      state.searchText = action.payload;
    },
    setShowMore: (state, action: PayloadAction<any>) => {
      state.showMore = action.payload;
    },
    setPage: (state, action: PayloadAction<any>) => {
      state.page = action.payload;
    },
    setNationality: (state, action: PayloadAction<any>) => {
      state.nationality = action.payload;
    },
    setSelectedCategories: (state, action: PayloadAction<any>) => {
      state.selectedCategories = action.payload;
    },
    setSelectedSubCategories: (state, action: PayloadAction<any>) => {
      state.selectedSubcategories = action.payload;
    },
    setSelectedLevels: (state, action: PayloadAction<any>) => {
      state.selectedLevels = action.payload;
    },
    setOffset: (state, action: PayloadAction<any>) => {
      state.offset = action.payload;
    },
    setSecSubcategories: (state, action: PayloadAction<any>) => {
      state.selectedSecsubcategories = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(getCourses.pending, state => {
      state.courseStatus = 'loading';
    }),
      builder.addCase(getCourses.fulfilled, (state, action) => {
        state.courseData = action.payload;
        state.courseStatus = 'success';
      }),
      builder.addCase(getCourses.rejected, state => {
        state.courseStatus = 'failed';
      }),
      builder.addCase(getCategories.pending, state => {
        state.categoryStatus = 'loading';
      }),
      builder.addCase(getCategories.fulfilled, (state, action) => {
        state.categoryData = action.payload;
        state.categoryStatus = 'success';
      }),
      builder.addCase(getCategories.rejected, state => {
        state.categoryStatus = 'failed';
      }),
      builder.addCase(getCategoryDetails.pending, state => {
        state.categoryDetailStatus = 'loading';
      }),
      builder.addCase(getCategoryDetails.fulfilled, (state, action) => {
        state.categoryDetails = action.payload;
        state.categoryDetailStatus = 'success';
      }),
      builder.addCase(getCategoryDetails.rejected, state => {
        state.categoryDetailStatus = 'failed';
      }),
      builder.addCase(getCategoryTeacher.pending, state => {
        state.categoryTeacherLoading = true;
      }),
      builder.addCase(getCategoryTeacher.fulfilled, (state, action) => {
        state.categoryTeacher = action.payload;
        state.categoryTeacherLoading = false;
      }),
      builder.addCase(getCategoryTeacher.rejected, state => {
        state.categoryTeacherLoading = false;
      }),
      // builder.addCase(getCourseDetail.fulfilled, (state, action) => {
      //   state.course = action.payload;
      //   state.courseDetailStatus = 'success';
      // }),
      builder.addCase(getCategoryCourseList.fulfilled, (state, action) => {
        state.categoryCourseList = action.payload;
        state.categoryCourseListStatus = 'success';
      }),
      builder.addCase(getCategoryCourseList.rejected, (state, action) => {
        state.categoryCourseList = action.payload;
        state.categoryCourseListStatus = 'failed';
      });
    // [getTeacherReviews.pending]: (state, action) => {
    //   state.teacherReviewsStatus = 'loading';
    // },
    // [getTeacherReviews.fulfilled]: (state, action) => {
    //   state.teacherReviewsStatus = 'success';
    //   state.teacherReviews = action.payload;
    // },
    // [getTeacherReviews.rejected]: (state, action) => {
    //   state.teacherReviewsStatus = 'failed';
    // }
  },
});

export const {
  fetchCourseSuccess,
  teacherAvailability,
  setTeacherReviews,
  setCurrentCourse,
  setSearchText,
  setShowMore,
  setPage,
  setNationality,
  setSelectedCategories,
  setSelectedLevels,
  setSelectedSubCategories,
  setOffset,
  setSecSubcategories,
} = courseSlice.actions;

export const courseState = (state: RootState) => state.course;

export default courseSlice.reducer;

export const getCourses = createAsyncThunk(
  'course/getCourses',
  async (final_data: FindCoursesInterfaceFinal) => {
    console.log(final_data.offset);
    const response = await ApiGateway.post(
      'courses/search?format=json&offset=' + final_data.offset,
      final_data.data,
    );
    return response.data;
  },
);

export const requestFreeSession = createAsyncThunk(
  'courses/requestFreeSession',
  async (data: any) => {
    console.log(data);
    let response;
    if (data.loggedIn) {
      response = ApiGateway.post(
        'userrequests/free-session?format=json&offset=0',
        data.formData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Token ' + data.userToken,
          },
        },
      );
    } else {
      response = ApiGateway.post(
        'userrequests/free-session?format=json&offset=0',
        data.formData,
        //  ,{
        //   headers: {
        //     'Content-Type': 'application/json',
        //     Authorization: 'Token ' + userDataToken,
        //   },
        // }
      );
    }

    console.log(response);
    return response;
  },
);

export const enrollNow = createAsyncThunk(
  'courses/enrollNow',
  async (finaldata: CourseEnrollInterface) => {
    let response = ApiGateway.post(
      'checkoutcourses/checkout-course?format=json',
      finaldata.data,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Token ' + finaldata.userToken,
        },
      },
    );

    // console.log(response.data);
    return response;
  },
);

export const iamInterestedinCourse = createAsyncThunk(
  'course/iamInterestedinCourse',
  async (final_data: any) => {
    let response;
    final_data.isLoggedIn
      ? (response = await ApiGateway.post(
          'userrequests/interested-user?format=json',
          final_data.data,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Token ' + final_data.userToken,
            },
          },
        ))
      : (response = await ApiGateway.post(
          'userrequests/interested-user?format=json',
          final_data.data,
        ));
    return response;
  },
  );

  export const getCourseDetail = createAsyncThunk(
    'courses/getCourseDetail',
    async (data: GetCourseDataInterface) => {
      let response;
      if (data.isLoggedIn) {
        response = await ApiGateway.get(
          'courses/course-detail-slug?category_slug=' +
            data.category_slug +
            '&teacher_slug=' +
            data.teacher_slug +
            '&course_slug=' +
            data.course_slug,
          false,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Token ' + data.userToken,
            },
          },
        );
        // return response;
      } else {
        response = await ApiGateway.get(
          'courses/course-detail-slug?category_slug=' +
            data.category_slug +
            '&teacher_slug=' +
            data.teacher_slug +
            '&course_slug=' +
            data.course_slug,
          false,
        );
        // return response;
      }
      // response = await ApiGateway.get("courses/" + courseSlug + "/?format=json&call_by=URL",false);
      // if(response.data.status === 'success'){
      //   return response.data.data
      // }
     return response;
    },
  );

  export const getReviews = createAsyncThunk('courses/getReviews',
  async(data : ReviewsInterface) => {
    let response;
    if(data.isLoggedIn){
      response= ApiGateway.get("courses/course-reviews?cr_tk=" +
      data.courseToken +
      "&offset=" +
      data.offset, false,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Token ' + data.userToken,
      },
    })
    }
    else{
      response= ApiGateway.get("courses/course-reviews?cr_tk=" +
      data.courseToken +
      "&offset=" +
      data.offset)
    }
    return response;
  })


  // return axios.get(
  //   API_URL +
  //     "/courses/course-detail-slug?category_slug=" +
  //     categorySlug +
  //     "&teacher_slug=" +
  //     teacherSlug +
  //     "&course_slug=" +
  //     courseSlug,
  //   { headers: { Authorization: "Token " + session.token } }
  // );



// https://neoapis.ipassio.com/api/courses/course-detail-slug?category_slug=bollywood-singing-classes&teacher_slug=shriram-iyer-music-academy&course_slug=advanced-bollywood-playback-singing-lessons
// https://neoapis.ipassio.com/api/courses/course-detail-slug?category_slug=vocal-music&teacher_slug=shriram-iyer-music-academy&course_slug=advanced-bollywood-playback-singing-lesson