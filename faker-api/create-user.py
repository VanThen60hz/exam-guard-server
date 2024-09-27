import requests
import json
from faker import Faker
import sys

# Khởi tạo Faker
fake = Faker()

# URL API
url = "http://localhost:8000/v1/api/user/create"

# Headers
headers = {
    'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmY0MTMyYWYzMmVmNDI2YjBjOTE0ODQiLCJlbWFpbCI6Im5ndXllbnZhbmFkbWluQGV4YW1wbGUuY29tIiwiaWF0IjoxNzI3NDIyMDYwLCJleHAiOjE3Mjc1OTQ4NjB9.gKdM8w1dACrC6-auHQSJUBXTIgn0bMwR3gyHTtag5aY',
    'x-client-id': '66f4132af32ef426b0c91484',
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
        # "role": fake.random_element(elements=("TEACHER", "STUDENT", "ADMIN")),
        "role": fake.random_element(elements=("STUDENT", "ADMIN")),
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
