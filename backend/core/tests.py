import csv
import io
from django.core.files.uploadedfile import SimpleUploadedFile

from core.models import FileUploadRegister

# Create your tests here.


def create_in_memory_csv():
    data = [["1", "2", "3"], ["4", "5", "6"], ["7", "8", "9"]]

    csv_buffer = io.StringIO()
    csv_writer = csv.writer(csv_buffer)
    csv_writer.writerows(data)

    csv_contents = csv_buffer.getvalue()
    csv_buffer.close()

    return csv_contents


def test_upload_files(client):
    csv = create_in_memory_csv()
    file = SimpleUploadedFile("file.csv", csv.encode(), content_type="text/csv")
    file2 = SimpleUploadedFile("file2.csv", csv.encode(), content_type="text/csv")

    res = client.post(
        "/api/submit_csv_register/", {"files": [file, file2]}, format="multipart"
    )
    entries = FileUploadRegister.objects.all()
    data = res.json()

    assert len(entries) == 2
    assert entries[0].file == "file.csv"
    assert entries[0].number_of_entries == 3
    assert res.status_code == 200
    assert data["success"] is True
