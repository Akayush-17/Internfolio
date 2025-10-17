# ---

# A script to automate the initial project setup steps based on the guide.

#

# Instructions:

# 1. Save this file as project-setup.sh

# 2. Give it execute permissions: chmod +x project-setup.sh

# 3. Edit the placeholder variables below.

# 4. Run the script: ./project-setup.sh

# ---

# --- Step 1: Clone the Project and Create Your Branch ---

# !!! IMPORTANT: Replace these placeholder values with your actual data !!!

REPOSITORY_URL="[repository-url]"
PROJECT_DIRECTORY="[project-directory-name]"
YOUR_BRANCH_NAME="your-name/feature"

echo "Step 1: Cloning repository and creating feature branch..."

# Clone the repository

git clone "$REPOSITORY_URL"
if [ $? -ne 0 ]; then
echo "Error: Failed to clone repository. Please check the URL."
exit 1
fi

# Navigate into the project directory

cd "$PROJECT_DIRECTORY"
if [ $? -ne 0 ]; then
    echo "Error: Directory '$PROJECT_DIRECTORY' not found after cloning."
exit 1
fi

# Create a new branch from main

git checkout -b "$YOUR_BRANCH_NAME"
echo "✅ Successfully created and switched to branch: $YOUR_BRANCH_NAME"
echo ""

# --- Step 2: Set Up Local Environment Variables ---

echo "Step 2: Setting up local environment variables..."

# Create a .env file from the example

cp .env.example .env
echo "✅ .env file created. Please add your Supabase and Mixpanel keys to this file."
echo ""

# --- Step 5: Preparing for the Pull Request (Example) ---

# The following commands are for when you have made changes and are ready to commit.

# They are commented out by default. Uncomment them to run.

#

# echo "Step 5: Staging and committing initial changes..."

#

# # Stage your changes

# git add .

#

# # Commit your staged changes

# git commit -m "feat: Set up feature branch and initial work"

#

# # Push your new branch to the remote repository

# git push -u origin "$YOUR_BRANCH_NAME"

#

# echo "✅ Branch pushed to remote. You can now create a pull request on GitHub."

echo "🚀 Project setup complete!"
