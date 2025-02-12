import { get } from "@/config/API";
import { userDetailsEndpoint } from "@/constants/APIEndpoints";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  accessTokenKeyBrowserStorage,
  refreshTokenKeyBrowserStorage,
  userIdKeyBrowserStorage,
} from "@/constants/browser-storage";
import {
  getLocalStorageItem,
  removeLocalStorageItem,
} from "@/lib/browser-storage";
import { deleteCookie } from "cookies-next";

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

export const fetchUserData: any = createAsyncThunk<FetchUserDataResponse, void>(
  "mockCredUser/fetchUser",
  async () => {
    const accessToken = getLocalStorageItem(accessTokenKeyBrowserStorage);
    if (accessToken) {
      const response = await get(userDetailsEndpoint);
      return { userDetails: response?.data };
    }
    throw new Error("User is not logged in.");
  }
);

export const logoutUser: any = createAsyncThunk(
  "mockCredUser/logoutUser",
  async () => {
    removeLocalStorageItem(accessTokenKeyBrowserStorage);
    removeLocalStorageItem(userIdKeyBrowserStorage);
    removeLocalStorageItem(refreshTokenKeyBrowserStorage);

    deleteCookie(accessTokenKeyBrowserStorage);
    deleteCookie(userIdKeyBrowserStorage);
    deleteCookie(refreshTokenKeyBrowserStorage);
  }
);

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
