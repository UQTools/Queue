import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: string;
};

export type Query = {
  __typename?: 'Query';
  getActiveRooms: Array<Room>;
  getRoomById: Room;
  me: User;
};


export type QueryGetActiveRoomsArgs = {
  courseCode: Scalars['String'];
};


export type QueryGetRoomByIdArgs = {
  roomId: Scalars['String'];
};

export type Room = {
  __typename?: 'Room';
  id: Scalars['String'];
  name: Scalars['String'];
  capacity: Scalars['Int'];
  enforceCapacity: Scalars['Boolean'];
  manuallyDisabled: Scalars['Boolean'];
  activeTimes: Array<WeeklyEvent>;
  queues: Array<Queue>;
  course: Course;
};

export type WeeklyEvent = {
  __typename?: 'WeeklyEvent';
  id: Scalars['Float'];
  startTime: Scalars['Float'];
  endTime: Scalars['Float'];
  day: Scalars['Int'];
  room: Room;
};

export type Queue = {
  __typename?: 'Queue';
  id: Scalars['String'];
  name: Scalars['String'];
  shortDescription: Scalars['String'];
  createdAt: Scalars['DateTime'];
  examples: Array<Scalars['String']>;
  theme: QueueTheme;
  sortedBy: QueueSortType;
  actions: Array<QueueAction>;
  room: Room;
  questions: Array<Question>;
  clearAfterMidnight: Scalars['Boolean'];
  showEnrolledSession: Scalars['Boolean'];
  activeQuestions: Array<Question>;
};


export enum QueueTheme {
  Gray = 'GRAY',
  Red = 'RED',
  Orange = 'ORANGE',
  Yellow = 'YELLOW',
  Green = 'GREEN',
  Teal = 'TEAL',
  Blue = 'BLUE',
  Cyan = 'CYAN',
  Purple = 'PURPLE',
  Pink = 'PINK'
}

export enum QueueSortType {
  Time = 'TIME',
  Questions = 'QUESTIONS',
  QuestionsAndTime = 'QUESTIONS_AND_TIME'
}

export enum QueueAction {
  Claim = 'CLAIM',
  Accept = 'ACCEPT',
  Remove = 'REMOVE',
  Email = 'EMAIL'
}

export type Question = {
  __typename?: 'Question';
  id: Scalars['String'];
  status: QuestionStatus;
  op: User;
  claimer?: Maybe<User>;
  createdTime: Scalars['DateTime'];
  claimTime?: Maybe<Scalars['DateTime']>;
  claimMessage?: Maybe<Scalars['String']>;
  queue: Queue;
  questionsAsked: Scalars['Int'];
  enrolledIn?: Maybe<Scalars['String']>;
};

export enum QuestionStatus {
  Open = 'OPEN',
  Claimed = 'CLAIMED',
  Closed = 'CLOSED',
  Accepted = 'ACCEPTED'
}

export type User = {
  __typename?: 'User';
  id: Scalars['String'];
  username: Scalars['String'];
  name: Scalars['String'];
  email: Scalars['String'];
  isOnline: Scalars['Boolean'];
  isAdmin: Scalars['Boolean'];
  courseStaff: Array<CourseStaff>;
  questions: Array<Question>;
  claimedQuestions: Array<Question>;
  courseMetas: Array<CourseUserMeta>;
};

export type CourseStaff = {
  __typename?: 'CourseStaff';
  id: Scalars['String'];
  role: StaffRole;
  user: User;
  course: Course;
};

export enum StaffRole {
  Staff = 'STAFF',
  Coordinator = 'COORDINATOR'
}

export type Course = {
  __typename?: 'Course';
  id: Scalars['String'];
  code: Scalars['String'];
  title: Scalars['String'];
  courseStaff: Array<CourseStaff>;
  userMetas: Array<CourseUserMeta>;
  rooms: Array<Room>;
};

export type CourseUserMeta = {
  __typename?: 'CourseUserMeta';
  id: Scalars['String'];
  user: User;
  course: Course;
  questionsAsked: Scalars['Int'];
  enrolledSession?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createQueue: Queue;
  updateQueue: Queue;
  createCourse: Course;
  addStaff: Array<CourseStaff>;
  createRoom: Room;
  updateRoom: Room;
  askQuestion: Question;
  updateQuestionStatus: Question;
};


export type MutationCreateQueueArgs = {
  queueInput: QueueInput;
  roomId: Scalars['String'];
};


export type MutationUpdateQueueArgs = {
  queueInput: QueueInput;
  queueId: Scalars['String'];
};


export type MutationCreateCourseArgs = {
  courseInput: CourseInput;
};


export type MutationAddStaffArgs = {
  role: StaffRole;
  usernames: Array<Scalars['String']>;
  courseId: Scalars['String'];
};


export type MutationCreateRoomArgs = {
  roomInput: RoomInput;
  courseId: Scalars['String'];
};


export type MutationUpdateRoomArgs = {
  roomInput: RoomInput;
  roomId: Scalars['String'];
};


export type MutationAskQuestionArgs = {
  queueId: Scalars['String'];
};


export type MutationUpdateQuestionStatusArgs = {
  message?: Maybe<Scalars['String']>;
  questionId: Scalars['String'];
  questionStatus: QuestionStatus;
};

export type QueueInput = {
  name: Scalars['String'];
  shortDescription: Scalars['String'];
  examples: Array<Scalars['String']>;
  theme: QueueTheme;
  sortedBy: QueueSortType;
  actions: Array<QueueAction>;
  clearAfterMidnight: Scalars['Boolean'];
  showEnrolledSession: Scalars['Boolean'];
};

export type CourseInput = {
  code: Scalars['String'];
  title: Scalars['String'];
};

export type RoomInput = {
  name: Scalars['String'];
  capacity: Scalars['Int'];
  enforceCapacity: Scalars['Boolean'];
  manuallyDisabled: Scalars['Boolean'];
  activeTimes: Array<EventInput>;
};

export type EventInput = {
  startTime: Scalars['Float'];
  endTime: Scalars['Float'];
  day: Scalars['Int'];
};

export type Subscription = {
  __typename?: 'Subscription';
  questionChanges: Question;
};


export type SubscriptionQuestionChangesArgs = {
  roomId: Scalars['String'];
};

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'username' | 'name' | 'isAdmin'>
    & { courseStaff: Array<(
      { __typename?: 'CourseStaff' }
      & Pick<CourseStaff, 'role'>
      & { course: (
        { __typename?: 'Course' }
        & Pick<Course, 'id' | 'code' | 'title'>
        & { rooms: Array<(
          { __typename?: 'Room' }
          & Pick<Room, 'id' | 'name' | 'capacity' | 'enforceCapacity' | 'manuallyDisabled'>
          & { activeTimes: Array<(
            { __typename?: 'WeeklyEvent' }
            & Pick<WeeklyEvent, 'startTime' | 'endTime' | 'day'>
          )> }
        )> }
      ) }
    )> }
  ) }
);

export type QuestionChangeSubscriptionVariables = Exact<{
  roomId: Scalars['String'];
}>;


export type QuestionChangeSubscription = (
  { __typename?: 'Subscription' }
  & { questionChanges: (
    { __typename?: 'Question' }
    & Pick<Question, 'id' | 'status' | 'createdTime' | 'questionsAsked' | 'enrolledIn' | 'claimMessage'>
    & { op: (
      { __typename?: 'User' }
      & Pick<User, 'email' | 'name' | 'username'>
    ), claimer?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'username' | 'name'>
    )>, queue: (
      { __typename?: 'Queue' }
      & Pick<Queue, 'id'>
    ) }
  ) }
);

export type AskQuestionMutationVariables = Exact<{
  queueId: Scalars['String'];
}>;


export type AskQuestionMutation = (
  { __typename?: 'Mutation' }
  & { askQuestion: (
    { __typename?: 'Question' }
    & Pick<Question, 'id' | 'status' | 'createdTime' | 'questionsAsked' | 'enrolledIn'>
    & { op: (
      { __typename?: 'User' }
      & Pick<User, 'email' | 'name' | 'username'>
    ), claimer?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'username' | 'name'>
    )>, queue: (
      { __typename?: 'Queue' }
      & Pick<Queue, 'id'>
    ) }
  ) }
);

export type UpdateQuestionStatusMutationVariables = Exact<{
  questionStatus: QuestionStatus;
  questionId: Scalars['String'];
  message?: Maybe<Scalars['String']>;
}>;


export type UpdateQuestionStatusMutation = (
  { __typename?: 'Mutation' }
  & { updateQuestionStatus: (
    { __typename?: 'Question' }
    & Pick<Question, 'id' | 'status' | 'createdTime' | 'questionsAsked' | 'enrolledIn'>
    & { op: (
      { __typename?: 'User' }
      & Pick<User, 'name' | 'email' | 'username'>
    ), claimer?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'username' | 'name'>
    )>, queue: (
      { __typename?: 'Queue' }
      & Pick<Queue, 'id'>
    ) }
  ) }
);

export type UpdateQueueMutationVariables = Exact<{
  queueId: Scalars['String'];
  queueInput: QueueInput;
}>;


export type UpdateQueueMutation = (
  { __typename?: 'Mutation' }
  & { updateQueue: (
    { __typename?: 'Queue' }
    & Pick<Queue, 'id' | 'name' | 'shortDescription' | 'examples' | 'actions' | 'theme' | 'sortedBy' | 'clearAfterMidnight' | 'showEnrolledSession' | 'createdAt'>
  ) }
);

export type CreateQueueMutationVariables = Exact<{
  roomId: Scalars['String'];
  queueInput: QueueInput;
}>;


export type CreateQueueMutation = (
  { __typename?: 'Mutation' }
  & { createQueue: (
    { __typename?: 'Queue' }
    & Pick<Queue, 'id' | 'name' | 'shortDescription' | 'examples' | 'actions' | 'theme' | 'sortedBy' | 'clearAfterMidnight' | 'showEnrolledSession' | 'createdAt'>
  ) }
);

export type GetActiveRoomsQueryVariables = Exact<{
  courseCode: Scalars['String'];
}>;


export type GetActiveRoomsQuery = (
  { __typename?: 'Query' }
  & { getActiveRooms: Array<(
    { __typename?: 'Room' }
    & Pick<Room, 'id' | 'name'>
  )> }
);

export type GetRoomByIdQueryVariables = Exact<{
  roomId: Scalars['String'];
}>;


export type GetRoomByIdQuery = (
  { __typename?: 'Query' }
  & { getRoomById: (
    { __typename?: 'Room' }
    & Pick<Room, 'id' | 'name'>
    & { queues: Array<(
      { __typename?: 'Queue' }
      & Pick<Queue, 'id' | 'name' | 'shortDescription' | 'examples' | 'actions' | 'theme' | 'sortedBy' | 'clearAfterMidnight' | 'showEnrolledSession' | 'createdAt'>
      & { activeQuestions: Array<(
        { __typename?: 'Question' }
        & Pick<Question, 'id' | 'status' | 'createdTime' | 'questionsAsked' | 'enrolledIn'>
        & { op: (
          { __typename?: 'User' }
          & Pick<User, 'name' | 'email' | 'username'>
        ), claimer?: Maybe<(
          { __typename?: 'User' }
          & Pick<User, 'username' | 'name'>
        )> }
      )> }
    )> }
  ) }
);

export type UpdateRoomMutationVariables = Exact<{
  roomId: Scalars['String'];
  roomInput: RoomInput;
}>;


export type UpdateRoomMutation = (
  { __typename?: 'Mutation' }
  & { updateRoom: (
    { __typename?: 'Room' }
    & Pick<Room, 'id' | 'name' | 'capacity' | 'enforceCapacity' | 'manuallyDisabled'>
    & { activeTimes: Array<(
      { __typename?: 'WeeklyEvent' }
      & Pick<WeeklyEvent, 'startTime' | 'endTime' | 'day'>
    )> }
  ) }
);

export type AddRoomMutationVariables = Exact<{
  courseId: Scalars['String'];
  roomInput: RoomInput;
}>;


export type AddRoomMutation = (
  { __typename?: 'Mutation' }
  & { createRoom: (
    { __typename?: 'Room' }
    & Pick<Room, 'id' | 'name' | 'capacity' | 'enforceCapacity' | 'manuallyDisabled'>
    & { activeTimes: Array<(
      { __typename?: 'WeeklyEvent' }
      & Pick<WeeklyEvent, 'startTime' | 'endTime' | 'day'>
    )> }
  ) }
);


export const MeDocument = gql`
    query Me {
  me {
    id
    username
    name
    isAdmin
    courseStaff {
      course {
        id
        code
        title
        rooms {
          id
          name
          capacity
          enforceCapacity
          manuallyDisabled
          activeTimes {
            startTime
            endTime
            day
          }
        }
      }
      role
    }
  }
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, baseOptions);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, baseOptions);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const QuestionChangeDocument = gql`
    subscription QuestionChange($roomId: String!) {
  questionChanges(roomId: $roomId) {
    id
    status
    op {
      email
      name
      username
    }
    createdTime
    claimer {
      username
      name
    }
    questionsAsked
    queue {
      id
    }
    enrolledIn
    claimMessage
  }
}
    `;

/**
 * __useQuestionChangeSubscription__
 *
 * To run a query within a React component, call `useQuestionChangeSubscription` and pass it any options that fit your needs.
 * When your component renders, `useQuestionChangeSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useQuestionChangeSubscription({
 *   variables: {
 *      roomId: // value for 'roomId'
 *   },
 * });
 */
export function useQuestionChangeSubscription(baseOptions: Apollo.SubscriptionHookOptions<QuestionChangeSubscription, QuestionChangeSubscriptionVariables>) {
        return Apollo.useSubscription<QuestionChangeSubscription, QuestionChangeSubscriptionVariables>(QuestionChangeDocument, baseOptions);
      }
export type QuestionChangeSubscriptionHookResult = ReturnType<typeof useQuestionChangeSubscription>;
export type QuestionChangeSubscriptionResult = Apollo.SubscriptionResult<QuestionChangeSubscription>;
export const AskQuestionDocument = gql`
    mutation AskQuestion($queueId: String!) {
  askQuestion(queueId: $queueId) {
    id
    status
    op {
      email
      name
      username
    }
    createdTime
    claimer {
      username
      name
    }
    questionsAsked
    queue {
      id
    }
    enrolledIn
  }
}
    `;
export type AskQuestionMutationFn = Apollo.MutationFunction<AskQuestionMutation, AskQuestionMutationVariables>;

/**
 * __useAskQuestionMutation__
 *
 * To run a mutation, you first call `useAskQuestionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAskQuestionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [askQuestionMutation, { data, loading, error }] = useAskQuestionMutation({
 *   variables: {
 *      queueId: // value for 'queueId'
 *   },
 * });
 */
export function useAskQuestionMutation(baseOptions?: Apollo.MutationHookOptions<AskQuestionMutation, AskQuestionMutationVariables>) {
        return Apollo.useMutation<AskQuestionMutation, AskQuestionMutationVariables>(AskQuestionDocument, baseOptions);
      }
export type AskQuestionMutationHookResult = ReturnType<typeof useAskQuestionMutation>;
export type AskQuestionMutationResult = Apollo.MutationResult<AskQuestionMutation>;
export type AskQuestionMutationOptions = Apollo.BaseMutationOptions<AskQuestionMutation, AskQuestionMutationVariables>;
export const UpdateQuestionStatusDocument = gql`
    mutation UpdateQuestionStatus($questionStatus: QuestionStatus!, $questionId: String!, $message: String) {
  updateQuestionStatus(
    questionStatus: $questionStatus
    questionId: $questionId
    message: $message
  ) {
    id
    status
    op {
      name
      email
      username
    }
    createdTime
    claimer {
      username
      name
    }
    questionsAsked
    queue {
      id
    }
    enrolledIn
  }
}
    `;
export type UpdateQuestionStatusMutationFn = Apollo.MutationFunction<UpdateQuestionStatusMutation, UpdateQuestionStatusMutationVariables>;

/**
 * __useUpdateQuestionStatusMutation__
 *
 * To run a mutation, you first call `useUpdateQuestionStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateQuestionStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateQuestionStatusMutation, { data, loading, error }] = useUpdateQuestionStatusMutation({
 *   variables: {
 *      questionStatus: // value for 'questionStatus'
 *      questionId: // value for 'questionId'
 *      message: // value for 'message'
 *   },
 * });
 */
export function useUpdateQuestionStatusMutation(baseOptions?: Apollo.MutationHookOptions<UpdateQuestionStatusMutation, UpdateQuestionStatusMutationVariables>) {
        return Apollo.useMutation<UpdateQuestionStatusMutation, UpdateQuestionStatusMutationVariables>(UpdateQuestionStatusDocument, baseOptions);
      }
export type UpdateQuestionStatusMutationHookResult = ReturnType<typeof useUpdateQuestionStatusMutation>;
export type UpdateQuestionStatusMutationResult = Apollo.MutationResult<UpdateQuestionStatusMutation>;
export type UpdateQuestionStatusMutationOptions = Apollo.BaseMutationOptions<UpdateQuestionStatusMutation, UpdateQuestionStatusMutationVariables>;
export const UpdateQueueDocument = gql`
    mutation UpdateQueue($queueId: String!, $queueInput: QueueInput!) {
  updateQueue(queueId: $queueId, queueInput: $queueInput) {
    id
    name
    shortDescription
    examples
    actions
    theme
    sortedBy
    clearAfterMidnight
    showEnrolledSession
    createdAt
  }
}
    `;
export type UpdateQueueMutationFn = Apollo.MutationFunction<UpdateQueueMutation, UpdateQueueMutationVariables>;

/**
 * __useUpdateQueueMutation__
 *
 * To run a mutation, you first call `useUpdateQueueMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateQueueMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateQueueMutation, { data, loading, error }] = useUpdateQueueMutation({
 *   variables: {
 *      queueId: // value for 'queueId'
 *      queueInput: // value for 'queueInput'
 *   },
 * });
 */
export function useUpdateQueueMutation(baseOptions?: Apollo.MutationHookOptions<UpdateQueueMutation, UpdateQueueMutationVariables>) {
        return Apollo.useMutation<UpdateQueueMutation, UpdateQueueMutationVariables>(UpdateQueueDocument, baseOptions);
      }
export type UpdateQueueMutationHookResult = ReturnType<typeof useUpdateQueueMutation>;
export type UpdateQueueMutationResult = Apollo.MutationResult<UpdateQueueMutation>;
export type UpdateQueueMutationOptions = Apollo.BaseMutationOptions<UpdateQueueMutation, UpdateQueueMutationVariables>;
export const CreateQueueDocument = gql`
    mutation CreateQueue($roomId: String!, $queueInput: QueueInput!) {
  createQueue(roomId: $roomId, queueInput: $queueInput) {
    id
    name
    shortDescription
    examples
    actions
    theme
    sortedBy
    clearAfterMidnight
    showEnrolledSession
    createdAt
  }
}
    `;
export type CreateQueueMutationFn = Apollo.MutationFunction<CreateQueueMutation, CreateQueueMutationVariables>;

/**
 * __useCreateQueueMutation__
 *
 * To run a mutation, you first call `useCreateQueueMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateQueueMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createQueueMutation, { data, loading, error }] = useCreateQueueMutation({
 *   variables: {
 *      roomId: // value for 'roomId'
 *      queueInput: // value for 'queueInput'
 *   },
 * });
 */
export function useCreateQueueMutation(baseOptions?: Apollo.MutationHookOptions<CreateQueueMutation, CreateQueueMutationVariables>) {
        return Apollo.useMutation<CreateQueueMutation, CreateQueueMutationVariables>(CreateQueueDocument, baseOptions);
      }
export type CreateQueueMutationHookResult = ReturnType<typeof useCreateQueueMutation>;
export type CreateQueueMutationResult = Apollo.MutationResult<CreateQueueMutation>;
export type CreateQueueMutationOptions = Apollo.BaseMutationOptions<CreateQueueMutation, CreateQueueMutationVariables>;
export const GetActiveRoomsDocument = gql`
    query GetActiveRooms($courseCode: String!) {
  getActiveRooms(courseCode: $courseCode) {
    id
    name
  }
}
    `;

/**
 * __useGetActiveRoomsQuery__
 *
 * To run a query within a React component, call `useGetActiveRoomsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetActiveRoomsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetActiveRoomsQuery({
 *   variables: {
 *      courseCode: // value for 'courseCode'
 *   },
 * });
 */
export function useGetActiveRoomsQuery(baseOptions: Apollo.QueryHookOptions<GetActiveRoomsQuery, GetActiveRoomsQueryVariables>) {
        return Apollo.useQuery<GetActiveRoomsQuery, GetActiveRoomsQueryVariables>(GetActiveRoomsDocument, baseOptions);
      }
export function useGetActiveRoomsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetActiveRoomsQuery, GetActiveRoomsQueryVariables>) {
          return Apollo.useLazyQuery<GetActiveRoomsQuery, GetActiveRoomsQueryVariables>(GetActiveRoomsDocument, baseOptions);
        }
export type GetActiveRoomsQueryHookResult = ReturnType<typeof useGetActiveRoomsQuery>;
export type GetActiveRoomsLazyQueryHookResult = ReturnType<typeof useGetActiveRoomsLazyQuery>;
export type GetActiveRoomsQueryResult = Apollo.QueryResult<GetActiveRoomsQuery, GetActiveRoomsQueryVariables>;
export const GetRoomByIdDocument = gql`
    query GetRoomById($roomId: String!) {
  getRoomById(roomId: $roomId) {
    id
    name
    queues {
      id
      name
      shortDescription
      examples
      actions
      theme
      sortedBy
      clearAfterMidnight
      showEnrolledSession
      activeQuestions {
        id
        op {
          name
          email
          username
        }
        status
        createdTime
        claimer {
          username
          name
        }
        questionsAsked
        enrolledIn
      }
      createdAt
    }
  }
}
    `;

/**
 * __useGetRoomByIdQuery__
 *
 * To run a query within a React component, call `useGetRoomByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRoomByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRoomByIdQuery({
 *   variables: {
 *      roomId: // value for 'roomId'
 *   },
 * });
 */
export function useGetRoomByIdQuery(baseOptions: Apollo.QueryHookOptions<GetRoomByIdQuery, GetRoomByIdQueryVariables>) {
        return Apollo.useQuery<GetRoomByIdQuery, GetRoomByIdQueryVariables>(GetRoomByIdDocument, baseOptions);
      }
export function useGetRoomByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRoomByIdQuery, GetRoomByIdQueryVariables>) {
          return Apollo.useLazyQuery<GetRoomByIdQuery, GetRoomByIdQueryVariables>(GetRoomByIdDocument, baseOptions);
        }
export type GetRoomByIdQueryHookResult = ReturnType<typeof useGetRoomByIdQuery>;
export type GetRoomByIdLazyQueryHookResult = ReturnType<typeof useGetRoomByIdLazyQuery>;
export type GetRoomByIdQueryResult = Apollo.QueryResult<GetRoomByIdQuery, GetRoomByIdQueryVariables>;
export const UpdateRoomDocument = gql`
    mutation UpdateRoom($roomId: String!, $roomInput: RoomInput!) {
  updateRoom(roomId: $roomId, roomInput: $roomInput) {
    id
    name
    capacity
    enforceCapacity
    manuallyDisabled
    activeTimes {
      startTime
      endTime
      day
    }
  }
}
    `;
export type UpdateRoomMutationFn = Apollo.MutationFunction<UpdateRoomMutation, UpdateRoomMutationVariables>;

/**
 * __useUpdateRoomMutation__
 *
 * To run a mutation, you first call `useUpdateRoomMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateRoomMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateRoomMutation, { data, loading, error }] = useUpdateRoomMutation({
 *   variables: {
 *      roomId: // value for 'roomId'
 *      roomInput: // value for 'roomInput'
 *   },
 * });
 */
export function useUpdateRoomMutation(baseOptions?: Apollo.MutationHookOptions<UpdateRoomMutation, UpdateRoomMutationVariables>) {
        return Apollo.useMutation<UpdateRoomMutation, UpdateRoomMutationVariables>(UpdateRoomDocument, baseOptions);
      }
export type UpdateRoomMutationHookResult = ReturnType<typeof useUpdateRoomMutation>;
export type UpdateRoomMutationResult = Apollo.MutationResult<UpdateRoomMutation>;
export type UpdateRoomMutationOptions = Apollo.BaseMutationOptions<UpdateRoomMutation, UpdateRoomMutationVariables>;
export const AddRoomDocument = gql`
    mutation AddRoom($courseId: String!, $roomInput: RoomInput!) {
  createRoom(courseId: $courseId, roomInput: $roomInput) {
    id
    name
    capacity
    enforceCapacity
    manuallyDisabled
    activeTimes {
      startTime
      endTime
      day
    }
  }
}
    `;
export type AddRoomMutationFn = Apollo.MutationFunction<AddRoomMutation, AddRoomMutationVariables>;

/**
 * __useAddRoomMutation__
 *
 * To run a mutation, you first call `useAddRoomMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddRoomMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addRoomMutation, { data, loading, error }] = useAddRoomMutation({
 *   variables: {
 *      courseId: // value for 'courseId'
 *      roomInput: // value for 'roomInput'
 *   },
 * });
 */
export function useAddRoomMutation(baseOptions?: Apollo.MutationHookOptions<AddRoomMutation, AddRoomMutationVariables>) {
        return Apollo.useMutation<AddRoomMutation, AddRoomMutationVariables>(AddRoomDocument, baseOptions);
      }
export type AddRoomMutationHookResult = ReturnType<typeof useAddRoomMutation>;
export type AddRoomMutationResult = Apollo.MutationResult<AddRoomMutation>;
export type AddRoomMutationOptions = Apollo.BaseMutationOptions<AddRoomMutation, AddRoomMutationVariables>;