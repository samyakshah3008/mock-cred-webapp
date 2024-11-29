import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  mockCredUser: UserDetails | null;
  status: "idle" | "pending" | "fulfilled" | "rejected";
  error: string | null;
}

interface UserDetails {
  id: string;
  firstName: string;
  email: string;
  lastName: string;
  isGuestUser: boolean;
}

interface FetchUserDataResponse {
  userDetails: UserDetails;
}

export const fetchUserData: any = () => {};

const initialState: UserState = {
  mockCredUser: null,
  status: "idle",
  error: null,
};

const userSlice = createSlice({
  name: "mockCredUser",
  initialState,
  reducers: {
    userSignedIn: (state, action: PayloadAction<UserDetails>) => {
      state.mockCredUser = action.payload;
    },
    userSignedOut: (state) => {
      state.mockCredUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.status = "pending";
      })
      .addCase(
        fetchUserData.fulfilled,
        (state, action: PayloadAction<FetchUserDataResponse>) => {
          state.mockCredUser = action.payload.userDetails;
          state.status = "fulfilled";
        }
      )
      .addCase(fetchUserData.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch user data";
        state.status = "rejected";
      });
  },
});

export const { userSignedIn, userSignedOut } = userSlice.actions;

export const userReducer = userSlice.reducer;
