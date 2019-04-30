import { Injectable } from '@angular/core';
import { ToasterConfigService, ToasterType } from './toaster-config.service';

interface StringMap {
  [s: string]: string;
}

const valueKey = '[[val]]';

const messages: StringMap = {
  'common.all_fields_are_mandatory': 'You must fill in all mandatory fields',
  'common.email_is_invalid': 'Email is not valid',
  'common.email_is_mandatory': 'Email is a mandatory field',
  'common.message_error': `Something went wrong. Please try again`,
  'common.feedback_send.message_success': `Feedback is sent!`,
  'common.feedback_already_created.message_error': `You already created feedback for this user!`,

  'google_autocomplete.choose_address_from_dropdown': 'Location is a required field.',
  'google_autocomplete.location_is_not_included_to_search':
      `No search results for Location.
      Please choose Location.`,

  'login.email.empty': 'Email field is empty',
  'login.password.empty': `Password field is empty`,
  'login.incorrect_credentials': 'You entered an incorrect email or password',

  'register.email.already_exists': 'Email address already exists',
  'register.password_short': `Your password must be at least 6 characters`,
  'register.password_not_match': `Passwords do not match`,
  'register.change_password.message_success': `Success! Redirecting you to login...`,
  'register.incorrect_first_name': 'Your Name can only contain letters and -,.` symbols.',
  'register.incorrect_last_name': 'Your Name can only contain letters and -,.` symbols.',
  'register.terms_of_use_or_privacy_policy_is_invalid': 'You need to agree to the Terms of Use incl. Crew Agreement to proceed ',
  'register.chargebee_connection.message_success': `Subscription created! Redirecting...`,

  'change_password.token_invalid': `This link is expired. Restart your session.`,
  'change_password.message_success': `Password is changed!`,

  'forgot.email_is_required.message_error': `Email is required`,
  'forgot.email_is_not_valid.message_error': `Your email address is not valid`,
  'forgot.have_sent_email.message_success': `We've sent an email. Check your email.`,

  'profile.get_media_url_error': `Video URL is not valid`,
  'profile.get_url_error': `URL is not valid`,
  'profile.get_input_error': `Input is not valid`,
  'profile.get_upload_drone_licence_error': `Upload your Drone Licence`,
  'profile.add_5_or_more_video_links': `Add 5 or more video links (Vimeo, YouTube only)`,
  'profile.upload_10_or_more_photos': `Upload 10 or more photos (.jpg, .jpeg only)`,
  'profile.have_not_select_speciality': `You haven't selected a speciality (Photo, Video etc)`,
  'profile.public_bio_should_be_50_words_or_more': `Public bio should be 50 words or more.`,
  'profile.public_bio_is_required': `Your Public bio is required (50 words or more).`,
  'profile.upload_profile_photo.message_error': `You must upload a profile photo`,
  'profile.experience_is_required.message_error': `Experience is a required field.`,
  'profile.user_blocked.message_success': `User blocked!`,
  'profile.user_block.message_error': `User block error!`,
  'profile.user_unblocked.message_success': `User unblocked!`,
  'profile.user_unblocked.message_error': `User unblock error!`,

  'user_profile.edited_from_admin.message_success': `Profile edited! Redirecting...`,
  'user_profile.edit_from_admin.message_error': `Profile edit error!`,
  'user_profile.get_user_names_error': `Can't get user names!`,
  'user_profile.user_already_exist': `This user already exists`,
  'user_profile.get_user_profile_information.message_error': `Can't get user profile information!`,
  'user_profile.edited.message_success': `Profile successfully edited!`,
  'user_profile.enter_ABN.message_error': `Please enter ABN`,
  'user_profile.enter_business_name.message_error': `Please enter business name`,
  'user_profile.enter_website.message_error': `Please enter your website`,
  'user_profile.website_not_valid.message_error': `Website is not valid`,

  'business_profile.are_you_registered_for_TAX': `Are you registered for Tax?`,
  'business_profile.done.message_success': `Done! Continue to your profile...`,
  'business_profile.edited.message_success': `Business profile edited!`,

  'settings.unsubscribe': 'Unsubscribe',
  'settings.unsubscribe.modal.message_success': 'You have unsubscribed. If in error, please contact Admin.',
  'settings.unsubscribe.modal.message_error': 'An error has occurred',
  'settings.settings_saved': `Settings saved.`,

  'choose_your_country.message.empty_country': 'Please choose your country',

  'job_view.apply_job.message_success': 'Successfully applied for a job',
  'job_view.cancel_applications.message_success': 'You have successfully canceled application for the job',

  'be_crew.there_are_no_new_jobs': 'There are no new jobs',
  'be_crew.hour.equal': `Hour fields can't be equal`,
  'be_crew.hour.from_less_min': `Hour-from value should be more than ${valueKey}`,
  'be_crew.hour.from_more_max': `Hour-from value should be less than ${valueKey}`,
  'be_crew.hour.to_less_min': `Hour-to value should be more than ${valueKey}`,
  'be_crew.hour.to_more_max': `Hour-to value should be less than ${valueKey}`,
  'be_crew.hour.less_first': `Hour-to value should be more than ${valueKey}`,
  'be_crew.amount.equal': `Amount fields can't be equal`,
  'be_crew.amount.from_less_min': `Amount-from value should be more than ${valueKey}`,
  'be_crew.amount.from_more_max': `Amount-from value should be less than ${valueKey}`,
  'be_crew.amount.to_less_min': `Amount-to value should be more than ${valueKey}`,
  'be_crew.amount.to_more_max': `Amount-to value should be less than ${valueKey}`,
  'be_crew.amount.less_first': `Amount-to value should be more than ${valueKey}`,
  'be_crew.date.less_first': `Date-to should be later than ${valueKey}`,
  'be_crew.date.equal': `Date fields can't be equal`,

  'send_offer.payment_failed': `Incorrect Card details. Your Payment is unsuccessful`,
  'send_offer.payment_success': `Payment successful!`,
  'send_offer.offer_already_sent': `Offer already sent`,

  'job.job_does_not_exist': `Sorry, this job is no longer available`,
  'job.accepted_job_can_not_edited': `Accepted job can't be edited`,
  'job.job_already_canceled.message_error': `This job already canceled`,
  'job.offer_error.message_error': `This Offer is no longer valid`,
  'job.accept_offer.success': `Offer accepted`,
  'job.decline_offer.success': `The Offer has been declined successfully`,

  'complete_job.complete_job_success': `Job is complete. Crew Payment will be released. `,
  'complete_job.review_filed_empty': `Please enter a review of your experience`,
  'complete_job.review_field_less_20_words': `Almost there. Your review should be 20 words or more`,
  'complete_job.rate_empty': `Review your experience out of 5`,
  'complete_job.job_closed.message_success': `Job closed!`,
  'complete_job.copied_to_clipboard.message_success': `Copied to clipboard!`,

  'notifications.you_have_no_new_notifications': 'You have no new notifications',

  'equipments.already_entered_that_equipment_type.massage_warning': `You have already entered that equipment type`,

  'renew_job.cant_renew': `Error. This Job cannot be renewed`,
  'renew_job.not_enough_days': `Error. This Job cannot be renewed`,
  'renew_job.renewing_success': `Job renewed!`,

  'cancel_job.canceling_success': `Job canceled!`,
  'cancel_job.canceling_error': `Something went wrong. Please try again`,

  'send_message_modal.message_is_empty': `Please enter a message`,
  'send_message.message_send_success': `Your message has been sent`,
  'send_message.message_send_error': `Something went wrong. Please try again`,

  'post_job.enter_the_job_owner.message_error': `Please enter the Job owner`,
  'post_job.enter_the_job_title.message_error': `Please enter the Job Title`,
  'post_job.job_brief_should_contain_50_word.message_error': `Job brief should contain 50 words or more`,
  'post_job.enter_the_job_location.message_error': `Please enter the Job Location`,
  'post_job.enter_job_date.message_error': `Please enter Job Date`,
  'post_job.price_can_not_be_0.message_error': `Price cannot be equal to 0`,
  'post_job.select_job_type.message_error': `Select Job type`,
  'post_job.file_is_loading.message_error': `File is loading! This shouldn't take too long`,
  'post_job.job_has_been_posted.message_success': `Done! Your Job has been posted`,
  'post_job.job_has_been_edited.message_success': `Done! Your Job has been edited`,

  'admin.user_profile.feedback.message_error': `Comment is required!`,
  'admin.user_profile.profile_is_declined.message_success': `Profile is declined! Redirecting to dashboard...`,
  'admin.user_profile.profile_is_approved.message_success': `Profile is approved! Redirecting to dashboard...`
};

@Injectable({providedIn: 'root'})
export class MessagesService {

  constructor(private toaster: ToasterConfigService) { }

  get(key: string, rest?: any[]): string {
    let _value = messages[key] || '';

    if (Array.isArray(rest)) {
      rest.forEach((i) => _value = _value.replace(valueKey, i));
    }

    return _value;
  }

  show(key: string, type: ToasterType = 'error', rest?: any[]): void {
    const message = this.get(key, rest);

    this.toaster[type](message);
  }

  showError(key: string, rest?: any[]): void {
    const message = this.get(key, rest);

    this.toaster.error(message);
  }

  showInfo(key: string, rest?: any[]): void {
    const message = this.get(key, rest);

    this.toaster.info(message);
  }

  showSuccess(key: string, rest?: any[]): void {
    const message = this.get(key, rest);

    this.toaster.success(message);
  }

  showWarning(key: string, rest?: any[]): void {
    const message = this.get(key, rest);

    this.toaster.warning(message);
  }
}
