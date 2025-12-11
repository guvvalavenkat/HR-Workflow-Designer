# 🚀 HR Workflow Designer — Visual Workflow Builder (React + React Flow)

A complete prototype of an **HR automation workflow designer** that allows HR teams to visually build, edit, validate, and simulate employee onboarding or other internal processes.  
This project fulfills all requirements specified in the assignment PDF, including:

- Drag-and-drop workflow creation  
- Node configuration forms  
- Validation engine  
- Workflow simulation  
- JSON import/export  
- Modern UI with React Flow  

---

# 📸 Screenshots

![WhatsApp Image 2025-12-11 at 08 49 20_6ee3982d](https://github.com/user-attachments/assets/e6d685dc-9730-4efa-b4eb-c0ca1e56af49)
<img width="1919" height="860" alt="image" src="https://github.com/user-attachments/assets/259281fc-dd39-4258-9947-b8da33e6edca" />
<img width="987" height="881" alt="image" src="https://github.com/user-attachments/assets/20232b87-3330-4a40-b881-cb3135063b39" />


---

# 📌 Features

### ✅ **1. Visual Workflow Canvas (React Flow)**  
Users can create a workflow visually by dragging components from the sidebar:

- **Start** – entry event  
- **Task** – manual action  
- **Approval** – decision gate  
- **Automated** – system action  
- **End** – workflow complete  

React Flow provides:
- Dragging  
- Connecting with edges  
- Selecting  
- Deleting  
- Undo / Redo  
- Mini-map  
- Zoom controls  

---

### ✅ **2. Node Details & Config Panel**

Each node type has configurable fields meeting PDF requirements:

#### **Start Node**
- Title  
- Summary  
- Description  

#### **Task Node**
- Title  
- Description  
- Assignee  
- Due date  
- Custom fields (key/value)  

#### **Approval Node**
- Approver role (Manager / HRBP / Director)  
- Auto-approve threshold  

#### **Automated Node**
- Automation type (from mock API)  
- Dynamic parameters (based on selected automation)  

#### **End Node**
- Final message  
- Summary checkbox  

---

### ✅ **3. Workflow Validation Engine**

Before simulation, the workflow is validated for:

- Exactly **1 Start** node  
- At least **1 End** node  
- No cycles  
- All nodes reachable  
- Required fields completed  
- Automated node references valid automation ID  

Validation results appear in the **Test panel**, with success/failure messages.

---

### ✅ **4. Workflow Simulation (Prototype)**

The **Run Simulation** button:

- Serializes the workflow  
- Validates structure  
- Simulates step-by-step execution  
- Produces execution logs, such as:  
  - "Start triggered"  
  - "Collect paperwork – assigned to HR Ops"  
  - "Manager approval required"  
  - "Send welcome email (template:new-hire)"  
  - "Workflow complete"  

All steps appear in a structured timeline UI.

---

### ✅ **5. JSON Import / Export**
- Export full workflow as JSON → `nodes + edges + configuration`  
- Import JSON to restore the workflow exactly  

---

### ✅ **6. Modern UI**
- Dark theme  
- Pixel grid (dotted canvas)  
- Color-coded nodes  
- Beautiful transitions  
- Clean form layout  

---

# 🛠️ Tech Stack

| Layer | Technology |
|------|------------|
| Framework | **React + TypeScript** |
| Canvas | **React Flow** |
| Styling | **Tailwind CSS / Custom CSS** |
| API Mocking | **MSW (Mock Service Worker)** or inline mock data |
| Build Tool | **Vite** |
| Validation | Custom graph validator |
| Simulation | Client-side execution engine |

---
