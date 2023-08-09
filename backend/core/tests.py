from django.conf import settings
from django.utils import timezone
from django.core.files.uploadedfile import SimpleUploadedFile
from core import services
from core.models import FileUploadRecord, EscalaRecord


def test_upload_multiple_files(client, mocker):
    mocker.patch("core.services.handle_csv_files")
    file = get_CSV_example_as_uploadedFile()
    file2 = get_CSV_example_as_uploadedFile()

    res = client.post("/api/files/", {"files": [file, file2]}, format="multipart")
    data = res.json()

    assert res.status_code == 200
    assert data["success"] is True


def test_correctly_record_number_of_rows_in_file():
    file = get_CSV_example_as_uploadedFile()

    services.handle_csv_files([file])  # type: ignore
    register = FileUploadRecord.objects.all().first()

    assert register is not None
    assert register.file == "file.csv"
    assert register.number_of_entries == 208


def test_record_escala_from_file():
    file = get_CSV_example_as_uploadedFile()

    services.handle_csv_files([file])  # type: ignore
    escalas = EscalaRecord.objects.all()
    files = FileUploadRecord.objects.all()

    assert len(escalas) == 208
    assert len(files) == 1
    assert escalas[0].matricula_colaborador
    assert escalas[0].timestamp
    assert escalas[0].file == files[0]


def get_CSV_example_as_uploadedFile():
    f = open(
        settings.BASE_DIR / "core" / "example_data" / "exemplo_arquivo_marcacoes.csv",
        "r",
    )
    return SimpleUploadedFile("file.csv", f.read().encode(), content_type="text/csv")


def test_get_escalar_for_a_day(client):
    today = timezone.now()
    escala_criada = EscalaRecord.objects.create(
        matricula_colaborador="123",
        timestamp=today,
        file=FileUploadRecord.objects.create(
            file="file.csv",
            number_of_entries=1,
        ),
    )

    res = client.get("/api/escalas/", {"day": today.date()})
    data = res.json()
    escalas = data["escalas"]

    assert escalas[0]["matricula_colaborador"] == "123"
    assert escalas[0]["timestamp"] == today.strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"
    assert escalas[0]["file"] == {"id": escala_criada.file_id, "file_name": "file.csv"}


def test_list_file_uploads(client):
    file_register = FileUploadRecord.objects.create(
        file="file.csv",
        number_of_entries=1,
    )

    res = client.get("/api/files/")
    data = res.json()
    files = data["files"]

    assert len(files) == 1
    assert files[0]["file_name"] == file_register.file.name
    assert files[0]["id"] == file_register.id
    assert files[0]["number_of_entries"] == file_register.number_of_entries
