import codecs
import csv

from ninja import UploadedFile
from core.models import FileUploadRegister


def handle_csv_schedule(files: list[UploadedFile]) -> list[FileUploadRegister]:
    file_registers = []
    for file in files:
        csv_handler = csv.reader(codecs.iterdecode(file, "utf-8"))
        rows = [row for row in csv_handler]
        file_registers.append(
            FileUploadRegister(
                file=file.name,
                number_of_entries=len(rows),
            )
        )

    created = FileUploadRegister.objects.bulk_create(file_registers)
    return created
