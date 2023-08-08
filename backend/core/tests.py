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


def test_upload_files(rf):
    rf.post(
        "/upload/",
        {
            "file": SimpleUploadedFile(
                "file.mp3", b"file_content", content_type="audio/mpeg"
            )
        },
        format="multipart",
    )

    # create a csv file

    response = "1"

    assert response.status_code == 200
