export interface Attendee {
  id: string;
  first_name: string;
  last_name: string | null;
  address: string | null;
  phone: string | null;
  graduation_date: string | null;
  days_attending: string[];
  willing_to_pay: string;
  willing_to_pay_other: string | null;
  dietary_restrictions: string[];
  dietary_other: string | null;
  plus_one: boolean;
  plus_one_count: number;
  plus_one_names: string | null;
  wants_to_sponsor: boolean;
  sponsorship_interest: string | null;
  donation_amount: string | null;
  anything_else: string | null;
  session_token: string;
  referral_code: string;
  referred_by: string | null;
  profile_pic_url: string | null;
  created_at: string;
}
