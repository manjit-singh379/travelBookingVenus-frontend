import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../Helpers/axiosInstance';
import { toast } from 'react-hot-toast';

// Interface for traveler details
export interface TravelerDetails {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
}

// Interface for booking data
export interface BookingData {
  travelPackageId: string;
  travelDate: string;
  travelerDetails: TravelerDetails[];
  totalTravelers: number;
}

// Interface for Booking state
export interface BookingState {
  bookings: BookingData[];
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: BookingState = {
  bookings: [],
  isLoading: false,
  error: null,
};

// Create a booking
export const createBooking = createAsyncThunk(
  'booking/createBooking',
  async (data: BookingData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/booking', data);
      toast.success('Booking created successfully!');
      return await response.data.booking;
    } catch (error: any) {
      toast.error('Failed to create booking');
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const fetchBookings = createAsyncThunk("bookings/" , async()=>{
  try{
    const response = await axiosInstance.get('/booking');
    toast.success("Booking Fetched Successfully");
    return await response.data.booking;
  }catch(error : any){
    toast.error('Failed to fetch bookings');
    return error?.response?.data;
  }
})


// Booking slice
const travelBookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createBooking.fulfilled, (state, action: PayloadAction<BookingData>) => {
        state.isLoading = false;
        state.bookings.push(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create booking';
      })
      
      .addCase(fetchBookings.pending , (state)=>{
        state.isLoading = true;
        state.error = null;
      })

      .addCase(fetchBookings.fulfilled , (state , action : PayloadAction<BookingData[]>)=>{
        state.isLoading = false;
        state.error = null;
        state.bookings = action.payload;
      })

      .addCase(fetchBookings.rejected , (state , action)=>{
        state.isLoading = true;
        state.error = action.error.message || "Something went wrong";
      })

      
  },
});

export default travelBookingSlice.reducer;