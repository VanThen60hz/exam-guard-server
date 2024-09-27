import requests
import json
from faker import Faker
import sys

# Khởi tạo Faker
fake = Faker()

# URL API
url = "http://localhost:8000/v1/api/signup"

# Headers
headers = {
    'x-api-key': '06a6d40c2e8f2e3d9398406f15af1ccf841bcdc640dee4929dd6f6ec5710dd4498cc24533406dc6f5f76dce3331c4892e0a6cd34c99c5990805744ffd4563ea1',
    'Content-Type': 'application/json'
}

# Lấy số lượng request từ command line
try:
    num_requests = int(sys.argv[1])
except (IndexError, ValueError):
    print("Please provide a valid number of requests.")
    sys.exit(1)

# Mật khẩu giữ nguyên
password = "securepassword123"

# Hàm tạo User ngẫu nhiên


def generate_random_user():
    return {
        "username": fake.user_name(),
        "name": fake.name(),
        "email": fake.email(),
        "password": password,
        "role": fake.random_element(elements=("TEACHER", "STUDENT", "ADMIN")),
        "gender": fake.random_element(elements=("MALE", "FEMALE")),
        "dob": fake.date_of_birth(minimum_age=18, maximum_age=65).strftime("%Y-%m-%d"),
        "phone_number": fake.phone_number(),
        "ssn": fake.random_number(digits=10),
        "address": fake.address(),
        "status": fake.random_element(elements=("ACTIVE", "INACTIVE", "SUSPENDED")),
    }


# Gửi request với dữ liệu ngẫu nhiên
for _ in range(num_requests):
    payload = json.dumps(generate_random_user())
    response = requests.post(url, headers=headers, data=payload)
    print(response.text)
