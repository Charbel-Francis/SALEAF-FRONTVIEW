### README.md  

# Final Year Sponsor App  

This mobile application is designed to connect sponsors with students, enable event registrations, and facilitate donations. It includes essential features like authentication, event registration, donation handling, and student profiles. The app is built with **React Native** for seamless cross-platform compatibility.

---

## Features  

### 1. **Home Page**  
- Displays:
  - **Login Card**: For user authentication.
  - **Latest 3 Events**: Showcases the three most recent events.
  - **Top 3 Students**: Highlights students in their final year.
- **Authentication Options**:
  - Tap the **Login button** or any feature requiring authentication.
  - Use the **Profile button** at the top to open the Login Modal.
  
---

### 2. **Authentication**  
- **Login Modal**:
  - Prompts the user for:
    - Email Address
    - Password
- **Create Account Modal**:
  - Prompts the user for:
    - First Name
    - Last Name
    - Email Address
    - Password
  - Options to:
    - Create Account
    - Navigate to Login Modal.
- Once logged in:
  - Users can access features based on their **role**.

---

### 3. **Sponsor Role**  
Sponsors can access the following sections:  

#### **Events**  
- **Events Overview**:
  - Displays all events with:
    - Description
    - Basic Details
  - Clicking an event shows a **Detailed View** with:
    - Complete Event Details
    - Registration Form:
      - Required Fields:
        - Package
        - First Name
        - Last Name
        - Email
        - Phone Number
      - Redirects to a **Payment Gateway** after submission.
  - **Payment Gateway**:
    - Returns a status:
      - Success
      - Failure
      - Canceled
  
#### **Donations**  
- Donation Process:
  - User selects or enters the **Donation Amount**.
  - If user details are missing, prompts for:
    - Income Tax Number
    - First Name
    - Last Name
    - ID Number
  - Continues to **Payment Options**:
    - **Online Payment**:
      - Redirects to a Payment Gateway.
      - Status redirects to:
        - Success
        - Failure
        - Canceled
    - **Manual Payment**:
      - Generates a **Reference Number**.
      - Requires proof of payment to be:
        - Uploaded in-app.
        - Emailed to the provided address.

#### **Students**  
- Displays a list of **Final Year Students**:
  - Clicking a student's profile provides:
    - Additional details (e.g., achievements, goals, etc.).
  - Supports job-seeking students by displaying their profiles.

#### **Profile**  
- Allows users to:
  - View all donations made.
  - Generate **Section 18A Certificates**.
  - Access events registered for, including **QR codes** for event check-ins.

---

## Installation  

1. **Clone the Repository**:  
   ```bash
   git clone https://github.com/your-repo/final-year-sponsor-app.git
   cd final-year-sponsor-app
   ```

2. **Install Dependencies**:  
   ```bash
   npm install
   ```

3. **Start the Application**:  
   ```bash
   npx expo start
   ```

---

## Technologies  

- **React Native**: Cross-platform mobile app development.
- **Expo**: Simplified app development workflow.
- **Payment Gateway**: Integrated for secure transactions.
- **QR Code Generator**: For event check-ins.
- **Section 18A Certificate Generator**: For donation records.

---

## Project Structure  

```plaintext
final-year-sponsor-app/
│
├── components/
│   ├── HomeCard.tsx
│   ├── EventList.tsx
│   ├── StudentProfiles.tsx
│   └── DonationForm.tsx
│
├── screens/
│   ├── HomeScreen.tsx
│   ├── EventsScreen.tsx
│   ├── StudentsScreen.tsx
│   └── ProfileScreen.tsx
│
├── navigation/
│   ├── AuthNavigator.tsx
│   ├── MainNavigator.tsx
│   └── TabNavigator.tsx
│
├── assets/
│   └── images/
├── App.tsx
├── package.json
└── README.md
```

---

## Future Enhancements  

- Add push notifications for upcoming events and donation campaigns.
- Implement a chat feature for sponsors and students.
- Enable multi-language support.

---

## License  

This project is licensed under the [MIT License](LICENSE).  

---

## Contact  

For queries, contact [your_email@example.com](mailto:your_email@example.com).  
