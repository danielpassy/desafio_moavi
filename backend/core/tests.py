from django.conf import settings
from django.utils import timezone
from django.core.files.uploadedfile import SimpleUploadedFile
from core import services
from core.models import FileUploadRegister, ShiftRegister


def test_upload_multiple_files(client, mocker):
    mocker.patch("core.services.handle_csv_schedule")
    file = get_CSV_example_as_uploadedFile()
    file2 = get_CSV_example_as_uploadedFile()

    res = client.post(
        "/api/submit_csv_register/", {"files": [file, file2]}, format="multipart"
    )
    data = res.json()

    assert res.status_code == 200
    assert data["success"] is True


def test_correct_register_number_of_rows():
    file = get_CSV_example_as_uploadedFile()

    services.handle_csv_schedule([file])  # type: ignore
    register = FileUploadRegister.objects.all().first()

    assert register is not None
    assert register.file == "file.csv"
    assert register.number_of_entries == 208


def test_register_shift_from_csv():
    file = get_CSV_example_as_uploadedFile()

    services.handle_csv_schedule([file])  # type: ignore
    shifts = ShiftRegister.objects.all()
    files = FileUploadRegister.objects.all()

    assert len(shifts) == 208
    assert len(files) == 1
    assert shifts[0].matricula_colaborador
    assert shifts[0].timestamp
    assert shifts[0].file == files[0]


def get_CSV_example_as_uploadedFile():
    f = open(
        settings.BASE_DIR / "core" / "example_data" / "exemplo_arquivo_marcacoes.csv",
        "r",
    )
    return SimpleUploadedFile("file.csv", f.read().encode(), content_type="text/csv")


def test_get_schedule_register_for_a_day(client):
    today = timezone.now()
    register = ShiftRegister.objects.create(
        matricula_colaborador="123",
        timestamp=today,
        file=FileUploadRegister.objects.create(
            file="file.csv",
            number_of_entries=1,
        ),
    )

    res = client.get("/api/schedules/", {"day": today.date()})
    data = res.json()
    schedules = data["schedules"]

    assert schedules[0]["matricula_colaborador"] == "123"
    assert (
        schedules[0]["timestamp"] == today.strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"
    )
    assert schedules[0]["file"] == register.file_id


def test_get_upload_register(client):
    file_register = FileUploadRegister.objects.create(
        file="file.csv",
        number_of_entries=1,
    )

    res = client.get("/api/file_register/")
    data = res.json()
    files = data["files"]

    assert len(files) == 1
    assert files[0]["file_name"] == file_register.file.name
    assert files[0]["id"] == file_register.id
    assert files[0]["number_of_entries"] == file_register.number_of_entries
