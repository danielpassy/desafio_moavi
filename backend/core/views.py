import codecs
import csv
from ninja import NinjaAPI
from ninja.files import UploadedFile

from core.models import FileUploadRegister

api = NinjaAPI()


@api.post("/submit_csv_register/")
def submit_csv_register(request, files: list[UploadedFile]):
    file_registers = []
    for file in files:
        try:
            csv_handler = csv.reader(codecs.iterdecode(file, "utf-8"))
            rows = [row for row in csv_handler]
            file_registers.append(
                FileUploadRegister(
                    file=file.name,
                    number_of_entries=len(rows),
                )
            )
        except Exception as e:
            print(e)

    created = FileUploadRegister.objects.bulk_create(file_registers)
    num_of_files = len(created)
    print(num_of_files)
    return 200, {"success": True}
