### README.md  

# Final Year Sponsor App  

This mobile application is built with **React Native** and designed to connect sponsors with students, enabling event registrations, donations, and detailed student profiles. The app is intended to help sponsors interact with the events, support donations, and track student progress, all while offering an intuitive interface and secure payment processing.

---

## Features  

### **1. Home Page**  
The home page is designed to provide a quick overview of essential information:  
- **Login Card**: This appears when a user is not logged in, offering quick access to the login or profile options.
- **Latest 3 Events**: Displays the three most recent events with brief descriptions and basic details.
- **Top 3 Final Year Students**: Highlights three students nearing graduation, providing a glimpse of their profiles and potential.

#### Authentication Options:
- **Login Button**: When users tap this button, a login modal appears prompting them to enter their **email** and **password**.
- **Profile Button**: Located at the top, this button opens a modal to log in or view the user profile.
- **Create Account Option**: A "Create Account" button is available within the login modal, allowing new users to create an account by providing:
  - First Name
  - Last Name
  - Email Address
  - Password
  - Option to either create the account or log in directly if they already have an account.

Once logged in, the app will allow users to navigate to any page relevant to their assigned role.

---

### **2. Authentication**  

#### **Login Modal**  
This modal prompts users to enter:
- **Email Address**
- **Password**

#### **Create Account Modal**  
This modal is used for new users to register an account and includes fields for:
- **First Name**
- **Last Name**
- **Email Address**
- **Password**
  
The modal provides buttons to either create an account or navigate to the login modal if the user already has an account.

Once authenticated, users can access features based on their assigned **role** (e.g., **Sponsor**).

---

### **3. Sponsor Role**  
The **Sponsor** role has specific pages and actions. Below are the main features for sponsors:

#### **Events Page**  
Sponsors can view all events listed in a compact format that includes:
- **Event Title**
- **Event Description**
- **Basic Event Details** (Date, Location, etc.)

#### **Event Registration**  
When a sponsor taps on an event:
- A **Detailed View** opens with more in-depth information about the event.
- Sponsors can register for the event by filling out the **Registration Form**:
  - **Package Selection**: Sponsors choose an event package.
  - **Personal Details**: First Name, Last Name, Email Address, and Phone Number.
- **Payment Process**: After registration, users are redirected to a **Payment Gateway**.
  - Depending on the payment status (success, failure, or cancellation), they will see different results.

#### **Donation Page**  
Sponsors can donate by choosing an amount or entering a custom amount. The process is as follows:
- **Enter Amount**: Sponsors select or input the amount they wish to donate.
- **User Details**: If the user hasn't provided personal details, the app prompts them for:
  - **Income Tax Number**
  - **First Name**
  - **Last Name**
  - **ID Number**
- **Continue to Payment**: After entering personal details, users are directed to the **Payment Method** selection.
  - **Online Payment**: Redirects users to a Payment Gateway. Based on the payment status, the user is shown:
    - Success Screen
    - Failure Screen
    - Canceled Screen
  - **Manual Payment**: If the user opts for manual payment, they receive a **Reference Number**.
    - The user must upload proof of payment or email it to the appropriate address.

#### **Students Page**  
The **Students Page** is designed to help sponsors view and interact with final-year students:
- **Final Year Students**: A list of students in their final year, looking for potential employment.
- **Profile Access**: Sponsors can click on a student's profile to view:
  - **Additional Data**: Achievements, job preferences, and more.

#### **Profile Page**  
The Profile page offers various functionalities:
- **Donation History**: Sponsors can view a list of their past donations.
- **Generate Section 18A Certificate**: For tax purposes, users can generate a Section 18A certificate for their donations.
- **Event Registrations**: Sponsors can see a list of events they've registered for and access QR codes for event check-ins.

---

## Installation  

Follow these steps to get the app up and running locally:

1. **Clone the Repository**:  
   ```bash
   git clone https://github.com/your-repo/final-year-sponsor-app.git
   cd final-year-sponsor-app
   ```

2. **Install Dependencies**:  
   Use npm to install the required dependencies.
   ```bash
   npm install
   ```

3. **Start the Application**:  
   Start the development server using Expo.
   ```bash
   npx expo start
   ```

---

## Technologies  

- **React Native**: A framework for building mobile apps using JavaScript and React.
- **Expo**: A framework and platform for universal React apps, simplifying the development process.
- **Payment Gateway**: Integrated for secure and efficient online payments.
- **QR Code Generator**: For generating and displaying QR codes for event check-ins.
- **Section 18A Certificate Generator**: To generate certificates for donations for tax purposes.

---



---

## Future Enhancements  

- Add push notifications to notify users about upcoming events or donation campaigns.
- Enable real-time chat between sponsors and students.
- Implement multi-language support for a broader audience.

---

## License  

This project is licensed under the **MIT License**. For more details, see the [LICENSE](LICENSE) file.

---

## Contact  

For any questions or issues, feel free to reach out to [your_email@example.com](mailto:your_email@example.com).
