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


def test_upload_multiple_files(client):
    csv = create_in_memory_csv()
    file = SimpleUploadedFile("file.csv", csv.encode(), content_type="text/csv")
    file2 = SimpleUploadedFile("file2.csv", csv.encode(), content_type="text/csv")

    res = client.post(
        "/api/submit_csv_register/", {"files": [file, file2]}, format="multipart"
    )
    data = res.json()

    assert res.status_code == 200
    assert data["success"] is True


def test_correct_register_number_of_rows(client):
    file = SimpleUploadedFile(
        "file.csv",
        create_in_memory_csv().encode(),
        content_type="text/csv",
    )

    client.post(
        "/api/submit_csv_register/",
        {"files": [file]},
        format="multipart",
    )
    register = FileUploadRegister.objects.all().first()

    assert register is not None
    assert register.file == "file.csv"
    assert register.number_of_entries == 3
