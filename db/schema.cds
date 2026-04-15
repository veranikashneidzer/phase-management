using {cuid} from '@sap/cds/common';

namespace sap.phaseManagement;

entity Customer : cuid {
      name          : String                       @mandatory;
      accountNumber : String                       @unique;
      contracts     : Composition of many Contract
                        on contracts.customer = $self;
}

entity Contract : cuid {
      description : String;
      startDate   : Date;
      endDate     : Date;
      currency    : String default 'EUR';
      status      : String enum {Active; Inactive; Draft};
      customer    : Association to Customer;
      phases      : Composition of many Phase
                        on phases.contract = $self;
}

entity Phase : cuid {
      name         : String                       @mandatory;
      startDate    : Date                         @mandatory;
      endDate      : Date                         @mandatory;
      monthlyPrice : Decimal(15,2);
      description  : String;
      contract     : Association to Contract;
}
