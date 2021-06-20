# My Clinic

- [Overview] 
My Clinic is a patient management software that streamlines and simplifies patient management for hospitals. 

- [Getting-started] 
There are four (4) models of users on My Clinic: 
- Hospital Admin 
- Doctors 
- Hospital Departments, Clinics, & Units 
- Patients 

- [Homepage] 
When you visit My Clinic’s root route at https://myclinicsample.herokuapp.com, you are taken to a loading page that automatically redirects you to the homepage of My Clinic. 

- [Using-My-Clinic-as-a-Hospital-Admin] 
Once you are on My Clinic’s homepage, a sign-up form is displayed. Fill this form to register as your hospital’s admin. The admin has oversight over the existence and activities of other users. Once you are registered, you are taken to an admin dashboard. The dashboard displays square-type button links to all the functionalities available to the hospital admin. These functionalities are: 

### View all departments, clinics & units 
-- See all departments, clinics & units: Click this button to see a table containing all the registered departments within the hospital. 

-- View a department’s information: To see the information of a particular department, click on the department’s name. This will take you to a page where that department’s information is displayed. This information includes the basic info, bookings (appointments), and investigations of the department. 

-- Remove a department, clinic, or unit: Once on a department’s information page, scroll to the bottom of the page and click the link labeled ‘Remove Department’. Clicking this link removes the department without warning, so tread with caution. 

- View all doctors 
See all doctors: Click this button to see a table containing all the registered doctors within the hospital. 

-- See a doctor’s information: To see the information of a particular doctor, click on the doctor’s name. This takes you to a page where you can see the doctor’s information including basic biodata and bookings. 

-- Remove a doctor: Once on a doctor’s information page, scroll to the bottom of the page and click the link labeled ‘Remove Doctor. Clicking this link removes the doctor without warning, so tread with caution. 

- View all patients 
-- See all patients: Click this button to see a table containing all the registered patient within the hospital. 

-- See a patient’s information: To see the information of a particular patient, click on the patient’s name. This takes you to a page where you can see the patient’s information including basic biodata and appointments. Copy a patient’s accession number; this will be used later. 

- Register an account 
Click this button to register an account to your hospital’s database. Once you click the button, you are taken to a page where you are asked to select the type of account you wish to register. You can register a department (or clinic, or unit), a doctor, or a patient. 

Register a department: Once you are on the account selection page, click the DEPARTMENT button to register a department. There are 3 steps and 3 pages involved in registering a department; completing a step take you to the next step in the process. 

Step 1: Provide a username and password and click ‘Register department’. 

Step 2: Enter the department’s name and head of department’s name and click ‘Confirm’. 

Step 3: Enter the investigations/procedures conducted at the department, together with their prices. Click the “+” button to enter a new investigation/procedure. Click the trash icon attached to an investigation to delete that investigation. Click ‘Confirm’ when you’re done entering all investigations. This completes the process of registering a department. The registered department can now use the username and password entered in step 1 to log into their departmental account (More details regarding this later). 

Register a doctor: Once you are on the account selection page, click the DOCTOR button to register a doctor. Fill the sign-up form and ‘Register doctor’. The registered doctor can now use the username and password entered during sign up to log into their doctor account (More details regarding this later). 

Register a patient: Once you are on the account selection page, click the PATIENT button to register a patient. Fill the sign-up form and ‘Register patient’. 

 

Generate patient invoice 

Click this button to generate an invoice for a patient. Clicking this button takes you to the ‘New Invoice’ page. First, fill the PATIENT INFO section of the page with the patient’s biodata. Then, for the first investigation that the patient wishes to pay for, enter the investigation’s name and price in the form provided in the INVESTIGATIONS section. Click the “+” button to add a new investigation, and click the trash icon to delete an investigation. Once you are done entering all investigations, click the ‘Generate Invoice’ button and wait for a while. Once you see a success message that the invoice has been generated, click the ‘Download Invoice’ button to download the newly generated invoice. The new invoice will be downloaded in pdf format. Click the ‘Go to dashboard’ button to go back to the admin dashboard. 

 

Send a broadcast message 

You can send a broadcast message to all doctors or all departments using this button. Click on the button. You will be taken to a page where you can send a broadcast message. First, use the select input to choose who you wish to send a broadcast message to (either departments or doctors). Then, enter the message you wish to send, and press ‘Send message’. 

 

- [Using My Clinic as a Doctor] 

On a new tab, enter and visit the address https://myclinicsample.herokuapp.com/login. On the page, click the DOCTOR button. Then, enter the login details you used to register a doctor above. Click ‘Login’. If login is successful, you’ll be taken to your doctor dashboard. Here, you can see all the functionalities available to a doctor. These are discussed as follows: 

New Booking 

This button allows a doctor to book a patient for investigations(s). Click it. There are 2 steps to booking a patient: 

Step 1: On the new booking page, paste the patient accession number that you copied above (from the Hospital Admin section of this document, while registering a patient) in the input filed labeled ‘Accession number’. Then, click ‘Find patient’. 

Step 2: If step 1 is successful, you’ll be redirected to a page where you can complete the booking process. The page contains the information of the patient who owns the accession number you pasted. Scroll down to the ‘INVESTIGATION REQUIRED’ section and, for each department that you want to send a patient to, enter the investigations you want the patient to perform in that department. Use the trash button to delete any department you don’t want to send the patient to. Once you’re done filling all the investigations you wish to enter, click ‘Confirm booking’. 

 

My bookings 

Go to your doctor dashboard. Click the ‘Bookings’ button to view all of the bookings (appointments) you have created. 

 

View patient info 

As a doctor, you might want to check the information of a particular patient. To do this, go to your doctor dashboard. Click the ‘View patient info’ button. There are 2 steps to viewing a patient’s info. 

	Step 1: On the ‘search for a patient’ page, paste the patient accession number that you copied above (from the Hospital Admin section of this document, while registering a patient) in the input filed labeled ‘Patient’s accession number’. Then, click ‘Search for patient’. 

If step 1 is successful, you’ll be redirected to a page where you can view all information regarding that particular patient, including the patient’s biodata, appointments, and reports. 

 

- [Using My Clinic as a Hospital Department, Clinic, or Unit] 

On a new tab, enter and visit the address https://myclinicsample.herokuapp.com/login. On the page, click the DEPARTMENT button. Then, enter the login details you used to register a department above. Click ‘Login’. If login is successful, you’ll be taken to your department’s dashboard. Here, you can see all the functionalities available to a department. These are discussed as follows: 

 

Profile 

View profile: On your dashboard, click the ‘Profile’ button to view your department’s profile. Your profile contains information including your department’s name and HOD’s name, as well as your department’s investigations and prices. 

Edit profile: On your profile, click ‘Edit basic information’ then proceed to edit your department’s name and HOD’s name. 

Edit investigations: On your profile, click ‘Edit investigations’. You’ll be taken to a page where you can edit, add to, or delete your department’s investigations. 

 

Bookings 

View all bookings: On your dashboard, click ‘Bookings’. You’ll be taken to a page where you can view all bookings associated with your department. If you don’t have bookings yet, the message ‘No bookings yet’ will be displayed instead. 

Authenticate a booking: Once you are on the bookings page, all bookings that have not yet been authenticated will have a 'Authenticate’ button. You can use this button to authenticate a booking. Authenticating a booking means that the investigations in the booking have been performed by your department. Click the ‘Authenticate’ button. Provide the name of the person that performed the investigations, then click ‘Authenticate appointment’. 

Write a report for a booking: Go to the bookings page. You can write a medical report for a booking that has been authenticated. It is normal practice to write a medical report for an investigation that has been performed. On the bookings page, all authenticated bookings should have 2 additional buttons: a ‘Write a report’ button and a ‘View reports’ button. 

Write a report: Use this button to write a medical report for a booking. Go to your bookings page. Go to the booking you wish to write a report for and click its ‘Write a report’ button. Fill the report form that is displayed on the page that just loaded and then click ‘Submit report’ to submit the report. 

View reports for a booking: Use this button to view all the reports you have written for a particular booking. Since it is common in medical practice to have multiple investigations for a booking, you could also have multiple medical reports for a particular booking. Go to your bookings page. Go to the booking whose reports you want to view and click its ‘View reports’ button. The report for that particular booking will be displayed on the page that loads. (Note: You can view reports that your department wrote. You cannot view a report that was written by another department.) 


Patient reports 
Click this button to view all the medical reports that your department has written. 

- [Log out] 
To log out at any time, click the caret-down icon on the navbar and click ‘LOG OUT’. 

- [License] 

This project has an MIT license, and thus is open source. 