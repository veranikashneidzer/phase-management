using {cuid} from '@sap/cds/common';

namespace sap.phaseManagement;

entity Customers : cuid {
      name          : String                       @mandatory;
      accountNumber : String                       @unique;
      contracts     : Composition of many Contracts
                        on contracts.customer = $self;
}

entity Contracts : cuid {
      description : String;
      startDate   : Date;
      endDate     : Date;
      currency    : String default 'EUR';
      status      : String enum {Active; Inactive; Draft};
      customer    : Association to Customers;
      phases      : Composition of many Phases
                        on phases.contract = $self;
}

entity Phases : cuid {
      name         : String                       @mandatory;
      startDate    : Date                         @mandatory;
      endDate      : Date                         @mandatory;
      monthlyPrice : Decimal(15,2);
      description  : String;
      contract     : Association to Contracts;
}
