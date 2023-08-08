import csv
import io
from django.core.files.uploadedfile import SimpleUploadedFile

# Create your tests here.


def create_in_memory_csv():
    data = ["oi", "Age"]

    csv_buffer = io.StringIO()
    csv_writer = csv.writer(csv_buffer)
    csv_writer.writerows(data)

    csv_contents = csv_buffer.getvalue()
    csv_buffer.close()

    return csv_contents


def test_upload_files(client):
    csv = create_in_memory_csv()
    file = SimpleUploadedFile("file.csv", csv.encode(), content_type="text/csv")

    res = client.post("/api/submit_csv_register/", {"file": file}, format="multipart")
    data = res.json()

    assert res.status_code == 200
    assert data["success"] is True
